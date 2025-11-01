import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Plus, Filter, Search, BarChart3, Calendar, Clock, CheckCircle } from 'lucide-react';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const categories = ['All', 'Work', 'Personal', 'Study', 'Other'];
  const statuses = ['All', 'Pending', 'Completed'];
  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'title', label: 'Title' },
    { value: 'category', label: 'Category' },
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      const updatedTask = await taskService.toggleTask(taskId, isCompleted);
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleBulkComplete = async (taskIds) => {
    try {
      const promises = taskIds.map(id => taskService.completeTask(id));
      await Promise.all(promises);
      await fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Error bulk completing tasks:', error);
    }
  };

  const handleBulkDelete = async (taskIds) => {
    if (window.confirm(`Are you sure you want to delete ${taskIds.length} tasks?`)) {
      try {
        const promises = taskIds.map(id => taskService.deleteTask(id));
        await Promise.all(promises);
        await fetchTasks(); // Refresh the list
      } catch (error) {
        console.error('Error bulk deleting tasks:', error);
      }
    }
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || 
        (filterStatus === 'Completed' && task.isCompleted) ||
        (filterStatus === 'Pending' && !task.isCompleted);
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'deadline') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(task => 
    !task.isCompleted && task.deadline && new Date(task.deadline) < new Date()
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600 mt-1">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Task
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-lg p-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-lg p-2">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {sortOptions.map(option => (
                <option key={`${option.value}-asc`} value={`${option.value}-asc`}>
                  {option.label} (A-Z)
                </option>
              ))}
              {sortOptions.map(option => (
                <option key={`${option.value}-desc`} value={`${option.value}-desc`}>
                  {option.label} (Z-A)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {searchTerm || filterCategory !== 'All' || filterStatus !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first task'
              }
            </p>
          </div>
        ) : (
          filteredAndSortedTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={(taskData) => handleUpdateTask(editingTask._id, taskData)}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskManagement;
