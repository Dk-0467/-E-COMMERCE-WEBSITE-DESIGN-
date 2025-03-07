import Home from '../pages/frontend/Home/Home';
import Signin from '../pages/frontend/Account/SignIn';
import SignUp from '../pages/frontend/Account/SignUp';
import Cart from '../pages/frontend/Cart/Cart';
import Shop from '../pages/frontend/Shop/Shop';
import About from '../pages/frontend/About/About';
import Contact from '../pages/frontend/Contact/Contact';
import Journal from '../pages/frontend/Journal/Journal';
import Offer from '../pages/frontend/Offer/Offer';
import Payment from '../pages/frontend/payment/Payment';
import ProductDetails from '../pages/frontend/ProductDetails/ProductDetails';
import UserProfile from '../pages/frontend/Account/UserProfile';
import UserOrders from '../pages/frontend/Account/UserOrders';

const RouterFrontend = [
    {path: "/", element: <Home />,},

    {path: "/signin", element: <Signin />,},
    {path: "/signup", element: <SignUp />,},
    {path: "/profile", element: <UserProfile />},
    {path: "/order", element: <UserOrders />},
    {path: "/shop", element: <Shop />,},
    {path: "/about", element: <About />,},
    {path: "/contact", element: <Contact />,},
    {path: "/journal", element: <Journal />,},
    {path: "/cart", element: <Cart />,},
    {path: "/offer", element: <Offer />,},
    {path: "/product/:name", element: <ProductDetails />,},
    {path: "/paymentgateway", element: <Payment />,},



    
]
export default RouterFrontend;  