import { useNavigate } from "react-router-dom";
import { useGetDashboardSummaryQuery } from "../store/slices/adminDashboardApi";


const StudentsOverview = () => {
  const { data, error, isLoading } = useGetDashboardSummaryQuery();
  const navigate = useNavigate()
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.data.message}</div>;

  const { students } = data || {};

  return (
    <div>
      <h1>Students Overview</h1>
      <p>Total Students: {students?.length || 0}</p>
      <ul>
        {students?.map((student) => (
          <li key={student._id}>{student.name} - {student.rollNumber}</li>
        ))}
      </ul>
      <button onClick={() => navigate('/admin-dashboard')}>Add</button>
    </div>
  );
};

export default StudentsOverview;