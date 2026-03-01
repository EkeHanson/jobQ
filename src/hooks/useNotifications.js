import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback } from 'react'
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
  addNotification,
} from '../store/notificationSlice'

export const useNotifications = (options = {}) => {
  const dispatch = useDispatch()
  const { notifications, unreadCount, loading, error } = useSelector(
    (state) => state.notifications
  )

  useEffect(() => {
    const params = options.unreadOnly ? { unread_only: true } : {}
    dispatch(fetchNotifications(params))

    // Optionally set up polling
    if (options.pollInterval) {
      const interval = setInterval(() => {
        dispatch(fetchNotifications(params))
      }, options.pollInterval)

      return () => clearInterval(interval)
    }
  }, [dispatch, options.pollInterval, options.unreadOnly])

  const markRead = useCallback(
    (notificationId) => dispatch(markAsRead(notificationId)),
    [dispatch]
  )

  const deleteNotif = useCallback(
    (notificationId) => dispatch(deleteNotification(notificationId)),
    [dispatch]
  )

  const addNew = useCallback(
    (notification) => dispatch(addNotification(notification)),
    [dispatch]
  )

  const refetch = useCallback(
    () => dispatch(fetchNotifications()),
    [dispatch]
  )

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markRead,
    deleteNotif,
    addNew,
    refetch,
  }
}
