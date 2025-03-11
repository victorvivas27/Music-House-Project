
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';

const ArrowBack = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackClick = () => {
        if (location.key !== "default") {
            navigate(-1);
        }
    };

    return (
        <div onClick={handleBackClick} style={{ cursor: 'pointer' }}>
            <ArrowBackIcon  />
        </div>
    );
};

export default ArrowBack;