import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    toast.info('Edit functionality coming soon!');
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner w-12 h-12 mx-auto mb-4"></div>
        <p className="text-secondary-600">Loading...</p>
      </div>
    </div>
  );
};

export default EditBlog; 