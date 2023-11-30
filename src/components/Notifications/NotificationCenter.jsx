import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationCenter } from 'react-toastify/addons/use-notification-center'
import styled from 'styled-components'

// import components
import { Trigger } from './Trigger'
import { ItemActions } from './ItemActions'
import { Switch } from './Switch'
import { TimeTracker } from './TimeTracker'
import { Button } from 'antd'
import { sliceTextWithEllipsis } from '../commonComponents/CommonItems';
// import { useDispatch } from 'react-redux';
// import { setClearNotification, setRemoveSingleItem, setMarkAsReadSingleItem } from '../../services/reducers/notificationReducer';

// import icons
import { IoInformationCircleSharp } from 'react-icons/io5';

// contains framer-motion variants to animate different parts of the UI
// when the notification center is visible or not
// https://www.framer.com/docs/examples/#variants
const variants = {
	container: {
		open: {
			y: 0,
			opacity: 1,
			scale: 1, // Add scale property for open state
		},
		closed: {
			y: -10,
			opacity: 0,
			scale: 0, // Set scale property to 0 for closed state and  also have zero width and height (scale: 0)
		},
	},
	// used to stagger item animation when switching from closed to open and vice versa
	content: {
		open: {
			transition: { staggerChildren: 0.07, delayChildren: 0.2 },
		},
		closed: {
			transition: { staggerChildren: 0.05, staggerDirection: -1 },
		},
	},
	item: {
		open: {
			y: 0,
			opacity: 1,
			transition: {
				y: { stiffness: 1000, velocity: -100 },
			},
		},
		closed: {
			y: 50,
			opacity: 0,
			transition: {
				y: { stiffness: 1000 },
			},
		},
	},
}

const UnreadFilter = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	label {
		cursor: pointer;
	}
`

const Container = styled(motion.aside)`
	width: min(60ch, 100ch);
	border-radius: 8px;
	overflow: hidden;

	position: absolute;
    top: 60px;
    margin-right: 60px;
    right: 0;
	transform: translateX(-100%);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`

const Footer = styled.footer`
	background: white;
    color: black;
	padding: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
    border-top: 2px solid #f0efeb;
`

const Content = styled(motion.section)`
	background: #fff;
    max-height: 80vh;
	overflow-y: auto;
	overflow-x: hidden;
	color: #000;
	padding: 0.2rem;
	position: relative;
	h4 {
		margin: 0;
		text-align: center;
		padding: 2rem;
	}
`

const Item = styled(motion.article)`
	display: grid;
    width: 100%;
	grid-template-columns: 40px 1fr 40px;
	gap: 8px;
	padding: 0.8rem;
	background: #f8f9fa;
    border: 1px solid #e9ecef;
	border-radius: 8px;
`

const Header = styled.header`
	background: white;
	color: black;
	margin: 0;
	padding: 0 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export function NotificationCenter() {
    // react toastify hook
	const { } = useNotificationCenter()

	const [showUnreadOnly, toggleFilter] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

    let retrievedData = localStorage.getItem('notifications');
    let notifications = [];
    if(retrievedData) {
        notifications = JSON?.parse(retrievedData)
    }

    // Retrieve the number from localStorage
    let unreadCount = parseInt(localStorage.getItem('unreadCount') ?? 0);

    // const dispatch = useDispatch()

    // const { notifications, unreadCount } = useSelector(state => state.notification)
    const [items, setItems] = useState([])
    
    // Clear readed message
    const clearAll = () => {
        // for localstorage
        localStorage.setItem('unreadCount', 0);
        localStorage.setItem('notifications', []);

        // reset state values
        notifications = []
        unreadCount = 0
        setItems([])
    }

    // Clear readed message
    const markAllAsRead = () => {
        if(notifications?.length) {
            const markAsReadList = notifications.map(item => ({...item, read: true}));
            // dispatch(setClearNotification(markAsReadList))

            // for localstorage
            localStorage.setItem('unreadCount', 0);
            localStorage.setItem('notifications', JSON?.stringify(markAsReadList));

            // update state values
            notifications = markAsReadList
            unreadCount = 0
            setItems([])

        } else return;
    }

    // mark single item
    const markAsReadSingleItem = (id) => {
        const updatedItem = notifications.map(item => (item.id === id ? {...item, read: true} : {...item}))
        // dispatch(setMarkAsReadSingleItem(updatedItem))

        // for localstorage
        localStorage.setItem('notifications', JSON?.stringify(updatedItem));
        if(unreadCount > 0 ) {
            localStorage.setItem('unreadCount', unreadCount - 1);
            unreadCount--;
        }
        
        // update state values
        notifications = updatedItem
        setItems([])
    }

    // remove single notification item
    const removeSingleItem = (id) => {
        // dispatch(setRemoveSingleItem(id))

        const findIndex = notifications.findIndex(item => item.id === id)
        if(!notifications[findIndex]?.read) {
            unreadCount > 0 && localStorage.setItem('unreadCount', unreadCount - 1);;
        }
        notifications.splice(findIndex, 1);
        localStorage.setItem('notifications', JSON?.stringify(notifications));
        setItems([])
    }

    const containerRef = useRef();

    // handle outside click handler
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
    
        const handleEscapeKey = (event) => {
          if (event.key === 'Escape') {
            setIsOpen(false);
          }
        };
    
        if (isOpen) {
          document.addEventListener('click', handleClickOutside);
          document.addEventListener('keydown', handleEscapeKey);
        }
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
          document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    // handle notificaton container open and close.
    const handleTriggerClick = () => {
        // Delay the update of the isOpen state
        setTimeout(() => {
          setIsOpen(!isOpen);
        }, 0);
    };

	return (
		<div>
			<Trigger onClick={handleTriggerClick} count={unreadCount} />
			<Container
                ref={containerRef}
				initial={false}
				variants={variants.container}
				animate={isOpen ? 'open' : 'closed'}
			>
				<Header>
					<h3>Notifications</h3>
					<UnreadFilter>
						<label htmlFor='unread-filter'>Only show unread</label>
						<Switch
							id='unread-filter'
							checked={showUnreadOnly}
							onChange={() => {
								toggleFilter(!showUnreadOnly)
							}}
						/>
					</UnreadFilter>
				</Header>
				<AnimatePresence>
					<Content variants={variants.content} animate={isOpen ? 'open' : 'closed'}>
						{(!notifications?.length || (unreadCount === 0 && showUnreadOnly)) && (
							<motion.h4
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								Your queue is empty! you are all set{' '}
								<span role='img' aria-label='dunno what to put'>
									🎉
								</span>
							</motion.h4>
						)}
						<AnimatePresence>
							{(showUnreadOnly
								? notifications.filter((v) => !v.read)
								: notifications
							)?.map((notification) => {
								return (
									<motion.div
										key={notification.id}
										layout
										initial={{ scale: 0.4, opacity: 0, y: 50 }}
										exit={{
											scale: 0,
											opacity: 0,
											transition: { duration: 0.2 },
										}}
										animate={{ scale: 1, opacity: 1, y: 0 }}
										style={{ padding: '0.3rem' }}
									>
										<Item
											key={notification.id}
											variants={variants.item}
										>
                                            <IoInformationCircleSharp color="#000" size={32}/>
											<div className={'grid'}>
												<div onClick={handleTriggerClick}>
                                                    <Link to={`/${notification.link}`} className={'text-black hover:text-blue-500'}>
                                                        {sliceTextWithEllipsis(notification.content, 45)}
                                                    </Link>
												</div>
												<TimeTracker createdAt={notification.createdAt} />
											</div>
											<ItemActions
												notification={notification}
												markAsRead={markAsReadSingleItem}
												remove={removeSingleItem}
											/>
										</Item>
									</motion.div>
								)
							})}
						</AnimatePresence>
					</Content>
				</AnimatePresence>
				<Footer>
                    <Button
                        type={'default'}
                        onClick={clearAll}
                        size={'small'}
                        style={{ margin: '5px', fontSize: '14px'}}
                    >
                        Clear All
                    </Button>
                    <Button
                        type={'default'}
                        onClick={markAllAsRead}
                        size={'small'}
                        style={{ margin: '5px', fontSize: '14px'}}
                    >
                        Mark all as read
                    </Button>
				</Footer>
			</Container>
		</div>
	)
}
