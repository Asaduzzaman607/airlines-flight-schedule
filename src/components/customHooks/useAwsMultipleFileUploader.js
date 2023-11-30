import { useState } from 'react'
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { getErrorMsg, showAlert } from '../../services/actions/commonActions';

const useAwsMultipleFileUploader = () => {
    const [Multipleprogress, setMultipleProgress] = useState(0);
    const [multipleSelectedFile, setMultipleSelectedFile] = useState([]);
    const [multipleObjectUrl, setMultipleObjectUrl] = useState('');
    const [isMultipleImageType, setIsMultipleImageType] = useState(true);

    const [multiplePreviewOpen, setMultiplePreviewOpen] = useState(false);
    const [multiplePreviewImage, setMultiplePreviewImage] = useState('');
    const [multiplePreviewTitle, setMultiplePreviewTitle] = useState('');
    
    // preview cancel handler
    const handleMultipleFileCancel = () => setMultiplePreviewOpen(false);

    // file preview handler
    const handlePreviewMultipleFile = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setMultiplePreviewImage(file.url || file.preview);
        setMultiplePreviewOpen(true);
        setMultiplePreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    }; 

    const onRemoveMultipleFileUploadHandler = (Key) => {
        setMultipleProgress(0)
        setMultipleObjectUrl('')
        setIsMultipleImageType(true)
    }

    // file uploadMultiple handler
    const uploadMultiple = async (file) => {
        const moduleName = "flight"
        const target = { 
            Bucket: "flightschedulebucket", 
            Key: moduleName + "/" + file?.name, 
            Body: file, 
            ContentType: file?.type
        };

        const awsClient = new S3Client({
            region: "ap-southeast-1",
            credentials: {
                accessKeyId: "AKIARL5XEC3YR25DTX4O",
                secretAccessKey: "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",
            },
            
        })

        try {
            const parallelUploads3 = new Upload({
                client: awsClient,
                params: target,
                leavePartsOnError: false, // optional manually handle dropped parts
            });

            parallelUploads3.on("httpUploadProgress", (Multipleprogress) => {       
                setMultipleProgress(Math.round((Multipleprogress.loaded / Multipleprogress.total) * 100))
            });

            const res = await parallelUploads3.done();
            setMultipleObjectUrl(res.Location)
         

        } catch (error) {
            console.error(error);
            const errMsg = getErrorMsg(error)

            // show error msg
            showAlert('error', errMsg)
        }
    };

    // check image or not
    const isImage = (file) => {
        const acceptedImageTypes = ['image/jpeg', 'image/png'];
        return acceptedImageTypes.includes(file.type);
    };

    const beforeUploadMultiple = (file) => {
        if (!isImage(file)) {
            // Handle non-image files here
            setIsMultipleImageType(false)
        }

        // Add the file to the multipleSelectedFile state array
        setMultipleSelectedFile([...multipleSelectedFile, file]); 

        uploadMultiple(file); // Handle the uploadMultiple directly when a file is selected
        return false; // Prevent the default uploadMultiple behavior
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
    });

    return {
        multipleSelectedFile,
        multipleObjectUrl,
        Multipleprogress,
        uploadMultiple,
        beforeUploadMultiple,
        getBase64,
        handleMultipleFileCancel,
        handlePreviewMultipleFile,
        multiplePreviewOpen,
        multiplePreviewImage,
        multiplePreviewTitle,
        setMultipleProgress,
        setMultipleSelectedFile,
        setMultipleObjectUrl,
        isMultipleImageType, 
        setIsMultipleImageType,
        onRemoveMultipleFileUploadHandler
    }
}

export default useAwsMultipleFileUploader