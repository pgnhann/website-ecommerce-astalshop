import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
} from "react-router-dom";
import Header from "./components/header/index"; 
import HeaderBottom from "./components/header/bottom"; 
import Footer from "./components/footer/index"; 
import FooterBottom from "./components/footer/bottom"; 
import SpecialIcon from "./components/specialicon";
import Home from "./pages/home";
import SignIn from "./pages/account/signin";
import ForgotPassword from "./pages/account/forgotpass";
import VerifyOTP from "./pages/account/verifyotp";
import ResetPassword from "./pages/account/resetpass";
import UserProfile from "./pages/account/profile";

import SignUp from "./pages/account/signup";
import About from "./pages/about";
import Journal from "./pages/journal";
import Contact from "./pages/contact";
import Shop from "./pages/shop";
import Cart from "./pages/cart";
import ProductDetails from "./pages/prodetails";
import Offer from "./pages/offer";
import Payment from "./pages/payment";
import JournalDetail from "./pages/journaldetail";

import Dashboard from "./admin/pages/dashboard"
import { ProductManagement } from "./admin/pages/product/product"; 
import { OrderManagement } from "./admin/pages/order/order"; 
import { UserManagement } from "./admin/pages/user"; 
import { JournalManagement } from "./admin/pages/journal/journal"; 
import { CommentManagement } from "./admin/pages/comment/comment"; 
import { CategoryManagement } from "./admin/pages/category/cate"; 

const Layout = () => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialIcon />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <FooterBottom />
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div>
      <ScrollRestoration />
      <Outlet />
    </div>
  );
};


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Routes cho người dùng */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/product/:_id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/paymentgateway" element={<Payment />} />
        <Route path="/journal/:id" element={<JournalDetail />} />
        <Route path="/userprofile" element={<UserProfile />} />
      </Route>

      {/* Các route khác (signup, signin, ...) */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verifyOTP" element={<VerifyOTP />} />
      <Route path="/resetpassword" element={<ResetPassword />} />

        {/* Routes cho admin */}
        <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/journals" element={<JournalManagement />} />
        <Route path="/admin/comments" element={<CommentManagement />} />
        <Route path="/admin/categories" element={<CategoryManagement />} />
      </Route>

    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;