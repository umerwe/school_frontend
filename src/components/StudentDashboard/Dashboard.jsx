import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    FaUserGraduate,
    FaClipboardCheck,
    FaWallet,
    FaArrowRight,
    FaBullhorn,
    FaCalendarAlt,
    FaClock,
    FaRobot,
    FaSpinner,
} from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { useGetDashboardSummaryQuery } from '../../store/slices/studentDashboardApi';
import AIAssistantButton from '../AIAssistantButton.jsx';

const PIE_COLORS = ['#4F46E5', '#EF4444'];

const StudentDashboard = () => {
    const navigate = useNavigate();
    const user = useSelector((store) => store.userSlice.user);

    // Fetch dashboard summary using RTK Query
    const { data, isLoading, error } = useGetDashboardSummaryQuery();

    // Process metrics from the summary data
    const metrics = data
        ? {
            attendancePercentage: (() => {
                const today = new Date().toISOString().split('T')[0];
                const todayRecord = data.attendance?.find(
                    (record) => new Date(record.date).toISOString().split('T')[0] === today
                );
                if (todayRecord) {
                    return todayRecord.status === 'present' ? 100 : 0;
                }
                return null; // No attendance data for today
            })(),
            attendanceStatus: (() => {
                const today = new Date().toISOString().split('T')[0];
                const todayRecord = data.attendance?.find(
                    (record) => new Date(record.date).toISOString().split('T')[0] === today
                );
                if (todayRecord) {
                    return todayRecord.status === 'present' ? 'Present' : 'Absent';
                }
                return 'Pending';
            })(),
            attendanceTrend: (() => {
                const endDate = new Date();
                const startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - 6);
                const trend = [];
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString().split('T')[0];
                    const record = data.attendance?.find(
                        (r) => new Date(r.date).toISOString().split('T')[0] === dateStr
                    );
                    const percentage = record?.status === 'present' ? 100 : 0;
                    trend.push({
                        date: dateStr,
                        percentage: Number(percentage.toFixed(1)),
                    });
                }
                return trend;
            })(),
            unpaidVouchers: data.vouchers?.filter((voucher) => voucher.status === 'unpaid').length || 0,
            paidVouchers: data.vouchers?.filter((voucher) => voucher.status === 'paid').length || 0,
            collectedFee: data.vouchers
                ?.filter((voucher) => voucher.status === 'paid')
                .reduce((sum, voucher) => sum + (voucher.amount || 0), 0) || 0,
            voucherStatus: [
                { name: 'Paid', value: data.vouchers?.filter((voucher) => voucher.status === 'paid').length || 0 },
                { name: 'Unpaid', value: data.vouchers?.filter((voucher) => voucher.status === 'unpaid').length || 0 },
            ],
            enrolledClass: data.classDetails
                ? `${data.classDetails.classTitle}-${data.classDetails.section}`
                : user?.studentClass && user?.section
                    ? `${user.studentClass}-${user.section}`
                    : 'None',
            announcements: data.announcements?.map((announcement) => ({
                title: announcement.title || 'Untitled',
                date: new Date(announcement.createdAt).toLocaleDateString(),
                id: announcement._id,
            })) || [],
        }
        : {
            attendancePercentage: null,
            attendanceStatus: 'Pending',
            attendanceTrend: [],
            unpaidVouchers: 0,
            paidVouchers: 0,
            collectedFee: 0,
            voucherStatus: [
                { name: 'Paid', value: 0 },
                { name: 'Unpaid', value: 0 },
            ],
            enrolledClass: user?.studentClass && user?.section ? `${user.studentClass}-${user.section}` : 'None',
            announcements: [],
        };
    // Metric cards
    const metricCards = [
        {
            title: "Today's Attendance",
            value: metrics.attendancePercentage === null ? 'Pending' : metrics.attendancePercentage === 100 ? 'Present' : 'Absent',
            icon: metrics.attendancePercentage === null ? <FaClock /> : <FaClipboardCheck />,
            color:
                metrics.attendancePercentage === null
                    ? 'bg-amber-500'
                    : metrics.attendancePercentage === 100
                        ? 'bg-emerald-500'
                        : 'bg-red-500',
            textColor:
                metrics.attendancePercentage === null
                    ? 'text-amber-500'
                    : metrics.attendancePercentage === 100
                        ? 'text-emerald-500'
                        : 'text-red-500',
            bgColor:
                metrics.attendancePercentage === null
                    ? 'bg-amber-50'
                    : metrics.attendancePercentage === 100
                        ? 'bg-emerald-50'
                        : 'bg-red-50',
            path: '/student-dashboard/attendance',
            description:
                metrics.attendancePercentage === null
                    ? 'Attendance not marked yet'
                    : metrics.attendancePercentage === 100
                        ? "You're present today"
                        : "You're absent today",
        },
        {
            title: 'Paid Vouchers',
            value: metrics.paidVouchers,
            icon: <FaWallet />,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-500',
            bgColor: 'bg-emerald-50',
            path: '/student-dashboard/fee-status',
            description: `${metrics.paidVouchers} paid fee vouchers`,
        },
        {
            title: 'Unpaid Vouchers',
            value: metrics.unpaidVouchers,
            icon: <FaWallet />,
            color: metrics.unpaidVouchers === 0 ? 'bg-emerald-500' : 'bg-red-500',
            textColor: metrics.unpaidVouchers === 0 ? 'text-emerald-500' : 'text-red-500',
            bgColor: metrics.unpaidVouchers === 0 ? 'bg-emerald-50' : 'bg-red-50',
            path: '/student-dashboard/fee-status',
            description: metrics.unpaidVouchers === 0 ? 'All fees paid' : `${metrics.unpaidVouchers} unpaid vouchers`,
        },
        {
            title: 'Enrolled Class',
            value: metrics.enrolledClass || 'None',
            icon: <FaUserGraduate />,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-500',
            bgColor: 'bg-indigo-50',
            path: '/student-dashboard/profile',
            description: 'Your current class',
        },
    ];

    // Quick actions
    const quickActions = [
        { label: 'Attendance', path: '/student-dashboard/attendance', icon: <FaClipboardCheck />, color: 'bg-blue-600' },
        { label: 'Fee Vouchers', path: '/student-dashboard/fee-status', icon: <FaWallet />, color: 'bg-purple-600' },
        { label: 'AI Assistant', path: '/student-dashboard/ai-assistant', icon: <FaRobot />, color: 'bg-indigo-600' },
    ];

    // Date formatter
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
        });
    };

    const capitalizeWords = (str) =>
        str
            ?.toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center min-h-[80vh] h-64">
                    <div className="flex flex-col items-center">
                        <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
                    <div className="flex items-center">
                        <IoMdAlert className="text-red-500 text-xl mr-3" />
                        <div>
                            <p className="text-red-800 font-medium">Error loading dashboard</p>
                            <p className="text-red-700 text-sm">{error.data?.message || 'Failed to fetch dashboard data'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {!isLoading && (
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Welcome Header */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                    Welcome, {capitalizeWords(user?.name || 'Student')}
                                </h1>
                                <p className="text-gray-600 text-sm">Here's your academic overview</p>
                            </div>
                            <div className="mt-3 text-sm sm:mt-3 hidden sm:flex px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 font-medium  items-center">
                                <FaCalendarAlt className="mr-2" />
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metricCards.map((card, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(card.path)}
                                className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                        <span className={`text-lg ${card.textColor}`}>{card.icon}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{card.title}</span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Voucher Status and Attendance Trend */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Attendance Trend */}
                        <div className="bg-white rounded-lg shadow border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800">Attendance Trend</h2>
                                    <button
                                        onClick={() => navigate('/student-dashboard/attendance')}
                                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        View details <FaArrowRight className="ml-1 text-xs" />
                                    </button>
                                </div>
                            </div>
                            <div className="pb-4 pt-12 pr-12">
                                <div className="h-74 flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={metrics.attendanceTrend}>
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 10 }}
                                                tickFormatter={formatDate}
                                                axisLine={{ stroke: '#E5E7EB' }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                tick={{ fontSize: 10 }}
                                                tickFormatter={(value) => `${value}%`}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                formatter={(value) => [`${value}%`, 'Attendance']}
                                                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                                                contentStyle={{
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="percentage"
                                                stroke="#4F46E5"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                activeDot={{ r: 5 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Voucher Status */}
                        <div className="bg-white rounded-lg shadow border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800">Fee Payment Status</h2>
                                    <button
                                        onClick={() => navigate('/student-dashboard/fee-status')}
                                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        View All <FaArrowRight className="ml-1 text-xs" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="h-62 flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={metrics.voucherStatus}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={70}
                                                innerRadius={45}
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {metrics.voucherStatus.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                        stroke="none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name) => [`${value} vouchers`, name]}
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Payment Stats */}
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-xs text-blue-600 font-medium">Total Collected</p>
                                        <p className="text-lg font-bold text-gray-800">PKR {metrics.collectedFee.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-pink-50 p-3 rounded-lg">
                                        <p className="text-xs text-pink-600 font-medium">Pending Payments</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {metrics.voucherStatus.find((s) => s.name === 'Unpaid')?.value || 0} vouchers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions and Announcements */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="font-semibold text-gray-800">Quick Actions</h2>
                            </div>
                            <div className="p-4">
                                <div className="space-y-2">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => navigate(action.path)}
                                            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <span className={`p-2 ${action.color} text-white rounded mr-3`}>{action.icon}</span>
                                                <span className="font-medium text-gray-700">{action.label}</span>
                                            </div>
                                            <FaArrowRight className="text-gray-400 text-sm" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Latest Announcements */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 lg:col-span-2">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800">Announcements</h2>
                                    <button
                                        onClick={() => navigate('/student-dashboard/announcements')}
                                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        View all <FaArrowRight className="ml-1 text-xs" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                {metrics.announcements.length > 0 ? (
                                    <div className="space-y-3">
                                        {metrics.announcements.slice(0, 3).map((announcement, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 bg-white border border-gray-100 rounded-lg hover:border-indigo-200 transition-colors shadow-sm"
                                            >
                                                <div className="flex items-start">
                                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg mr-3 mt-0.5">
                                                        <FaBullhorn className="text-sm" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center">
                                                            <h3 className="font-medium text-gray-800">{capitalizeWords(announcement.title)}</h3>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-2">{announcement.date}</p>
                                                        <button
                                                            onClick={() => navigate('/student-dashboard/announcements')}
                                                            className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                                        >
                                                            Read more
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <FaBullhorn className="mx-auto text-gray-300 text-2xl mb-2" />
                                        <p className="text-gray-500">No announcements available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <AIAssistantButton />
        </div>
    );
};

export default StudentDashboard;