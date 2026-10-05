import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import ProgramDetails from './pages/ProgramDetails';
import InternshipDetails from './pages/InternshipDetails';
import NotFound from './pages/NotFound';
import JobDetails from './pages/JobDetails';
import JobCategory from './pages/JobCategory';
import JobApplication from './pages/JobApplication';
import CampusAmbassador from './pages/CampusAmbassador';
import DataSciencePage from './pages/DataSciencePage';
import HireFromUs from './pages/HireFromUs';

// Admin imports
import { AuthProvider } from './admin/context/AuthContext';
import AdminLayout from './admin/components/AdminLayout';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLogin from './admin/pages/AdminLogin';
import AdminResetPassword from './admin/pages/AdminResetPassword';
import AdminDashboard from './admin/pages/AdminDashboard';
import TestimonialList from './admin/pages/testimonials/TestimonialList';
import TestimonialForm from './admin/pages/testimonials/TestimonialForm';
import BlogList from './admin/pages/blogs/BlogList';
import BlogForm from './admin/pages/blogs/BlogForm';
import BlogDetails from './pages/BlogDetails';

// CMS Advanced Features
import AuthorList from './admin/pages/authors/AuthorList';
import AuthorForm from './admin/pages/authors/AuthorForm';
import CategoryList from './admin/pages/categories/CategoryList';
import CategoryForm from './admin/pages/categories/CategoryForm';
import TagList from './admin/pages/tags/TagList';
import AdsList from './admin/pages/ads/AdsList';
import AdForm from './admin/pages/ads/AdForm';

// CRM
import ProgramEnquiryList from './admin/pages/enquiries/ProgramEnquiryList';
import InternshipEnquiryList from './admin/pages/enquiries/InternshipEnquiryList';
import HireFromUsList from './admin/pages/enquiries/HireFromUsList';
import InternshipApplicationList from './admin/pages/applications/InternshipApplicationList';

// Careers
import JobCategoryList from './admin/pages/careers/JobCategoryList';
import JobCategoryForm from './admin/pages/careers/JobCategoryForm';
import JobList from './admin/pages/careers/JobList';
import JobForm from './admin/pages/careers/JobForm';
import ApplicationList from './admin/pages/careers/ApplicationList';
import ApplicationDetail from './admin/pages/careers/ApplicationDetail';
import BottomContactBar from './components/BottomContactBar';
import GoogleReviewsTab from './components/GoogleReviewsTab';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/jobs" element={<Careers />} />
          <Route path="/careers/jobs/:slug" element={<JobDetails />} />
          <Route path="/careers/jobs/:slug/apply" element={<JobApplication />} />
          <Route path="/careers/category/:slug" element={<JobCategory />} />
          <Route path="/programs/:slug" element={<ProgramDetails />} />
          <Route path="/internships/:slug" element={<InternshipDetails />} />
          <Route path="/campus-ambassador" element={<CampusAmbassador />} />
          <Route path="/data-science" element={<DataSciencePage />} />
          <Route path="/hire-from-us" element={<HireFromUs />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true} />}>
            {/* The AdminLayout serves as the layout wrapper for child routes */}
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              
              <Route path="testimonials" element={<TestimonialList />} />
              <Route path="testimonials/new" element={<TestimonialForm />} />
              <Route path="testimonials/:id/edit" element={<TestimonialForm />} />

              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/new" element={<BlogForm />} />
              <Route path="blogs/:id/edit" element={<BlogForm />} />

              {/* Authors */}
              <Route path="authors" element={<AuthorList />} />
              <Route path="authors/new" element={<AuthorForm />} />
              <Route path="authors/:id/edit" element={<AuthorForm />} />

              {/* Categories */}
              <Route path="categories" element={<CategoryList />} />
              <Route path="categories/new" element={<CategoryForm />} />
              <Route path="categories/:id/edit" element={<CategoryForm />} />

              {/* Tags */}
              <Route path="tags" element={<TagList />} />

              {/* Ads */}
              <Route path="ads" element={<AdsList />} />
              <Route path="ads/new" element={<AdForm />} />
              <Route path="ads/:id/edit" element={<AdForm />} />

              {/* Lead Management */}
              <Route path="program-enquiries" element={<ProgramEnquiryList />} />
              <Route path="internship-enquiries" element={<InternshipEnquiryList />} />
              <Route path="internship-applications" element={<InternshipApplicationList />} />
              <Route path="hire-from-us" element={<HireFromUsList />} />

              {/* Careers */}
              <Route path="jobs" element={<JobList />} />
              <Route path="jobs/new" element={<JobForm />} />
              <Route path="jobs/:id/edit" element={<JobForm />} />
              <Route path="job-categories" element={<JobCategoryList />} />
              <Route path="job-categories/new" element={<JobCategoryForm />} />
              <Route path="job-categories/:id/edit" element={<JobCategoryForm />} />
              <Route path="applications" element={<ApplicationList />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomContactBar />
        <GoogleReviewsTab />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
