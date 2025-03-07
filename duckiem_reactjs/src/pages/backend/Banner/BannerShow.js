import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BannerService from "../../../services/BannerServices"; 

const BannerShow = () => {
    const { id } = useParams();
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await BannerService.show(id);
                if (response.status) {
                    setBanner(response.banner);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Đã xảy ra lỗi khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, [id]);

    if (loading) {
        return <div className="text-center text-gray-500">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    const imageSrc = `http://127.0.0.1:8000/images/banner/${banner.image}`;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Chi Tiết Banner</h1>
            {banner ? (
                <div className="bg-white shadow-md rounded-lg p-4 max-w-md mx-auto border border-gray-200">
                    <div className="mb-4">
                        <label className="block font-medium text-sm mb-1 text-gray-700">Tên Banner:</label>
                        <span className="text-gray-600">{banner.name}</span>
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium text-sm mb-1 text-gray-700">Vị trí:</label>
                        <span className="text-gray-600">{banner.position}</span>
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium text-sm mb-1 text-gray-700">Mô tả:</label>
                        <span className="text-gray-600">{banner.description}</span>
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium text-sm mb-1 text-gray-700">Trạng thái:</label>
                        <span className={`text-sm ${banner.status === 1 ? "text-green-500" : "text-red-500"}`}>
                            {banner.status === 1 ? "Hoạt động" : "Không hoạt động"}
                        </span>
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium text-sm mb-2 text-gray-700">Hình ảnh:</label>
                        <div className="flex justify-center mb-2">
                            <img 
                                src={imageSrc} 
                                alt={banner.name} 
                                className="max-w-[150px] h-auto rounded-md shadow-sm"
                            />
                        </div>
                        <span className="block text-center text-gray-500 text-xs">Hình ảnh của banner</span>
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium text-sm mb-1 text-gray-700">Ngày tạo:</label>
                        <span className="text-gray-600 text-sm">{new Date(banner.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-red-500">Không tìm thấy dữ liệu</div>
            )}
        </div>
    );
};

export default BannerShow;
