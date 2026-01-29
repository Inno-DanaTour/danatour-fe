import React from 'react';
import { useLottie } from 'lottie-react';

interface LottieAnimationProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ src, className, style }) => {
    const [animationData, setAnimationData] = React.useState(null);

    React.useEffect(() => {
        fetch(src)
            .then(response => response.json())
            .then(data => setAnimationData(data))
            .catch(error => console.error('Error loading Lottie animation:', error));
    }, [src]);

    const options = {
        animationData,
        loop: true,
        autoplay: true,
    };

    const { View } = useLottie(options, style);

    return animationData ? <div className={className}>{View}</div> : null;
};

export default LottieAnimation;
