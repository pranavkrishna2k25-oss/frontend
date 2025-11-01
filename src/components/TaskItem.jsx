import { useState } from 'react';
import { Calendar, Clock, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

const TaskItem = ({ task, onUpdate, onDelete, onToggleComplete, onEdit }) => {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date() && !task.isCompleted;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: 'bg-blue-100 text-blue-800',
      Personal: 'bg-green-100 text-green-800',
      Study: 'bg-purple-100 text-purple-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.Other;
  };

  const handleToggle = () => {
    onToggleComplete(task._id, !task.isCompleted);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md ${
        task.isCompleted ? 'opacity-75' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className="mt-1 flex-shrink-0"
        >
          {task.isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 hover:text-green-500" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-lg font-medium ${
                task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                  {task.category}
                </span>
                
                {task.deadline && (
                  <div className={`flex items-center gap-1 text-sm ${
                    isOverdue(task.deadline) ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(task.deadline)}</span>
                  </div>
                )}
                
                {task.reminder && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(task.reminder)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-2 ml-4 transition-opacity duration-200 ${
              showActions ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                title="Edit task"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        taskTitle={task.title}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TaskItem;
