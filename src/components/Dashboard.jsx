import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import TaskForm from './TaskForm';
import { CheckSquare, Clock, Calendar, TrendingUp, Plus } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const tasks = await taskService.getTasks();
      
      const now = new Date();
      const completed = tasks.filter(task => task.isCompleted).length;
      const pending = tasks.filter(task => !task.isCompleted).length;
      const overdue = tasks.filter(task => 
        !task.isCompleted && task.deadline && new Date(task.deadline) < now
      ).length;
      
      setStats({
        total: tasks.length,
        completed,
        pending,
        overdue,
      });

      // Get recent tasks (last 5)
      const sortedTasks = tasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setRecentTasks([newTask, ...recentTasks.slice(0, 4)]);
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1,
      }));
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your task overview.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3">
              <CheckSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
        </div>
        <div className="p-6">
          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-500 mb-4">Create your first task to get started!</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors mx-auto"
              >
                <Plus className="h-4 w-4" />
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map(task => (
                <div key={task._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <h3 className={`font-medium ${
                        task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                        {task.deadline && (
                          <span className="text-sm text-gray-500">
                            Due: {formatDate(task.deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(task.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
