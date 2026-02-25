import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SellerDetailPage from './pages/SellerDetailPage';
import ChatWidget from './components/ChatWidget';
import ProtectedRoute from './components/ProtectedRoute';

// Root layout
function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}

// Public layout with chat widget
function PublicLayout() {
  return (
    <>
      <Outlet />
      <ChatWidget />
    </>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/',
  component: HomePage,
});

// Seller detail is a direct child of rootRoute so its route ID is '/sellers/$id'
const sellerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sellers/$id',
  component: SellerDetailPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: () => (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([homeRoute]),
  sellerDetailRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
