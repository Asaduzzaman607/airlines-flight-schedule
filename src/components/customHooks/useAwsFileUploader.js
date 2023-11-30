import { useState } from 'react'
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

const useAwsFileUploader = () => {
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState([]);
    const [objectUrl, setObjectUrl] = useState('');
    const [isImageType, setIsImageType] = useState(true);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleFileInput = (e) => {
        setProgress(0)
        setSelectedFile(e?.file?.originFileObj);
    };

    // file change handler
    const handleChange = ({ fileList: newFileList }) => setSelectedFile(newFileList)

    // preview cancel handler
    const handleCancel = () => setPreviewOpen(false);

    // file preview handler
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const onRemoveFileUploadHandler = () => {
        setProgress(0)
        setObjectUrl('')
        setIsImageType(true)
    }

    // file upload handler
    const upload = async (file) => {
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

            parallelUploads3.on("httpUploadProgress", (progress) => {       
                setProgress(Math.round((progress.loaded / progress.total) * 100))
            });

            const res = await parallelUploads3.done();
            setObjectUrl(res.Location)
         

        } catch (error) {
            console.error(error);
        }
    };

    // check image or not
    const isImage = (file) => {
        const acceptedImageTypes = ['image/jpeg', 'image/png'];
        return acceptedImageTypes.includes(file.type);
    };

    const beforeUpload = (file) => {
        if (!isImage(file)) {
            // Handle non-image files here
            setIsImageType(false)
        }
        upload(file); // Handle the upload directly when a file is selected
        return false; // Prevent the default upload behavior
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
    });

    return {
        selectedFile,
        objectUrl,
        progress,
        handleFileInput,
        upload,
        handleChange,
        beforeUpload,
        getBase64,
        handleCancel,
        handlePreview,
        previewOpen,
        previewImage,
        previewTitle,
        setProgress,
        setSelectedFile,
        setObjectUrl,
        isImageType, 
        setIsImageType,
        onRemoveFileUploadHandler
    }
}

export default useAwsFileUploader