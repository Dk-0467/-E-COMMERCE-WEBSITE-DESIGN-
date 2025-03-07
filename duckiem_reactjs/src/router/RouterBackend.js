import BannerList from '../pages/backend/Banner/BannerList';
import BannerEdit from '../pages/backend/Banner/EditBanner';
import BannerShow from '../pages/backend/Banner/BannerShow';
import AddBanner from '../pages/backend/Banner/BannerAdd';
import BannerTrash from '../pages/backend/Banner/BannerTrash';

import ProductCreate from '../pages/backend/Products/ProductCreate';
import Product from '../pages/backend/Products/ProductList';
import ProductDetail from '../pages/backend/Products/ProductDetail';
import UpdateProduct from '../pages/backend/Products/ProductUpdate';
import ProductTrash from '../pages/backend/Products/ProductTrash';

import BrandList from '../pages/backend/Brand/brandList';
import BrandAdd from '../pages/backend/Brand/brandAdd';
import BrandShow from '../pages/backend/Brand/brandShow';
import BrandEdit from '../pages/backend/Brand/brandEdit';
import BrandTrash from '../pages/backend/Brand/brandTrash';

import TopicList from '../pages/backend/Topic/topicList';
import AddTopic from '../pages/backend/Topic/topicAdd';
import TopicDetail from '../pages/backend/Topic/topicShow';
import EditTopic from '../pages/backend/Topic/topicEdit';
import TopicTrash from '../pages/backend/Topic/topicTrash';
import UserList from '../pages/backend/User/userList';
import AddUser from '../pages/backend/User/userAdd';
import UserDetail from '../pages/backend/User/userShow';
import EditUser from '../pages/backend/User/userEdit';
import UserTrash from '../pages/backend/User/userTrash';

import ConfigList from '../pages/backend/Config/configList';
import EditConfig from '../pages/backend/Config/configEdit';
import CategoryList from '../pages/backend/Category/catList';
import CategoryDetail from '../pages/backend/Category/catShow';
import ProductStore from '../pages/backend/productStore/ProductStoreList';

import ProductSaleList from '../pages/backend/ProductSale/ProductSaleList';
import AddProductSale from '../pages/backend/ProductSale/ProductSaleAdd';
import ProductStoreCreate from '../pages/backend/productStore/ProductStoreCreate';

import PostList from '../pages/backend/Post/PostList';
import ProductSaleDetail from '../pages/backend/ProductSale/ProductSaleDetail';
import ProductSaleUpdate from '../pages/backend/ProductSale/ProductSaleUpdate';
import ProductStoreDetail from '../pages/backend/productStore/ProductStoreDetail';
import UpdateProductStore from '../pages/backend/productStore/ProductStoreUpdate';
import TrashProductStore from '../pages/backend/productStore/ProductStoreTrash';
import ProductSaleTrash from '../pages/backend/ProductSale/ProductSaleTrash';
import AddCategory from '../pages/backend/Category/catAdd';
import UpdateCategory from '../pages/backend/Category/catUpdate';
import CategoryTrash from '../pages/backend/Category/catTrash';
import PostShow from '../pages/backend/Post/PostShow';
import PostAdd from '../pages/backend/Post/PostAdd ';
import PostUpdate from '../pages/backend/Post/PostUpdate';
import PostTrash from '../pages/backend/Post/PostTrash';
import OrderList from '../pages/backend/Order/OrderList';
import OrderShow from '../pages/backend/Order/OrderShow';
import OrderTrash from '../pages/backend/Order/OrderTrash';
import MenuList from '../pages/backend/Menu/MenuList';
import MenuShow from '../pages/backend/Menu/MenuShow';
import AddMenu from '../pages/backend/Menu/MenuAdd';
import EditMenu from '../pages/backend/Menu/MenuUpdate';
import MenuTrash from '../pages/backend/Menu/MenuTrash';
import ContactList from '../pages/backend/Contact/ContactList ';
import ContactDetail from '../pages/backend/Contact/Show';
import ContactTrash from '../pages/backend/Contact/Trash';
import ReplyContact from '../pages/backend/Contact/Reply';





const RouterBackend = [
    //products
    { path: "/admin/product", element: <Product /> },
    { path: "/admin/products/create", element: <ProductCreate /> },
    { path: "/admin/products_show/:id", element: <ProductDetail /> },
    { path: "/admin/products_update/:id", element: <UpdateProduct /> },
    { path: "/admin/products_trash", element: <ProductTrash /> },

    //productStore
    { path: "/admin/productStore", element: <ProductStore /> },
    { path: "/admin/productStore_add", element: <ProductStoreCreate /> },
    { path: "/admin/productStore_show/:id", element: <ProductStoreDetail/> },
    { path: "/admin/productStore_update/:id", element: <UpdateProductStore/> },
    { path: "/admin/productStore_trash", element: <TrashProductStore /> },

    //productSale
    { path: "/admin/productSale", element: <ProductSaleList /> },
    { path: "/admin/productSale_add", element: <AddProductSale /> },
    { path: "/admin/productSale_show/:id", element: <ProductSaleDetail/> },
    { path: "/admin/productSale_update/:id", element: <ProductSaleUpdate /> },
    { path: "/admin/productSale_trash", element: <ProductSaleTrash /> },

    //banner
    { path: "/admin/banner", element: <BannerList /> }, 
    { path: "/admin/banner_add", element: <AddBanner /> },
    { path: "/admin/show/:id", element: <BannerShow /> },
    { path: "/admin/edit_banner/:id", element: <BannerEdit /> },
    { path: "/admin/banner_trash", element: <BannerTrash /> },

    //brand
    { path: "/admin/brand", element: <BrandList /> }, 
    { path: "/admin/brand_add", element: <BrandAdd /> }, 
    { path: "/admin/brand_show/:id", element: <BrandShow /> },
    { path: "/admin/edit_brand/:id", element: <BrandEdit /> },
    { path: "/admin/brand_trash", element: <BrandTrash /> },

    //category
    { path: "/admin/category", element: <CategoryList /> }, 
    { path: "/admin/cat_add", element: <AddCategory /> }, 
    { path: "/admin/cat_show/:id", element: <CategoryDetail /> },
    { path: "/admin/edit_cat/:id", element: <UpdateCategory /> },
    { path: "/admin/cat_trash", element: <CategoryTrash /> },

    //topic
    { path: "/admin/topic", element: <TopicList /> }, 
    { path: "/admin/topic_add", element: <AddTopic /> }, 
    { path: "/admin/topic_show/:id", element: <TopicDetail /> },
    { path: "/admin/edit_topic/:id", element: <EditTopic /> },
    { path: "/admin/topic_trash", element: <TopicTrash /> },

    //user
    { path: "/admin/user", element: <UserList /> }, 
    { path: "/admin/user_add", element: <AddUser /> }, 
    { path: "/admin/user_show/:id", element: <UserDetail /> },
    { path: "/admin/edit_user/:id", element: <EditUser /> },
    { path: "/admin/user_trash", element: <UserTrash /> },

    //config
    { path: "/admin/config", element: <ConfigList /> }, 
    { path: "/admin/edit_config/:id", element: <EditConfig /> },

    //post
    { path: "/admin/post", element: <PostList /> }, 
    { path: "/admin/post_show/:id", element: <PostShow /> },
    { path: "/admin/post_add", element: <PostAdd /> }, 
    { path: "/admin/post_edit/:id", element: <PostUpdate /> },
    { path: "/admin/post_trash", element: <PostTrash /> },

    //order 
    { path: "/admin/order", element: <OrderList /> }, 
    { path: "/admin/order_show/:id", element: <OrderShow /> },
    { path: "/admin/order_trash", element: <OrderTrash /> },

    //menu
    { path: "/admin/menu", element: <MenuList /> }, 
    { path: "/admin/menu_show/:id", element: <MenuShow /> },
    { path: "/admin/menu_edit/:id", element: <EditMenu /> },
    { path: "/admin/menu_add", element: <AddMenu /> }, 
    { path: "/admin/menu_trash", element: <MenuTrash /> },

    //contect
    { path: "/admin/contact", element: <ContactList /> }, 
    { path: "/admin/contact_show/:id", element: <ContactDetail /> }, 
    { path: "/admin/contact_trash", element: <ContactTrash /> },
    { path: "/admin/contact_reply/:id", element: <ReplyContact /> }, 



]
export default RouterBackend;