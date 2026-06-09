import {parseColor} from "@/utils/image-utils";

interface ProductImageProps {
    title?: string,
    image?: string,
    size?: '80' | '400' | '800',
    defaultColor?: string,
    imageUrl?: string,
}

export default function ProductImage({
                                                       image,
                                                       size = '80',
                                                       defaultColor,
                                                       imageUrl
                                                   }:ProductImageProps) {
    const imageFile = parseColor(imageUrl || image || 'missing.png', defaultColor || '');
    const src = 'https://intranet.chums.com/images/products/:size/:imageFile'
        .replace(':size', encodeURIComponent(size))
        .replace(':imageFile', encodeURIComponent(imageFile));
    return (
        <div>
            <img className="img-thumbnail" src={src} alt={imageUrl || image} title={imageFile}/>
        </div>
    )
}
