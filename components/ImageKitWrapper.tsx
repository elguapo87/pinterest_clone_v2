import { Image } from "@imagekit/next";

type ImageKitProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    quality?: number | "auto";
    imgWidth?: number;
    priority?: boolean;
};

const ImageKitWrapper = ({
    src,
    alt,
    width,
    height,
    className,
    quality = "auto",
    imgWidth = 400,
    priority = false
}: ImageKitProps) => {

    const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

     const blurUrl = `${urlEndpoint}${src}?tr=w-20,q-10,bl-30`;

    return (
        <Image
            urlEndpoint={urlEndpoint}
            src={src}
            width={width}
            height={height}
            alt={alt}
            className={className}
            loading={priority ? "eager" : "lazy"}
            transformation={[
                `w-${imgWidth},q-${quality},f-auto,dpr-auto` as any
            ]}
            placeholder={priority ? undefined : "blur"}
            blurDataURL={blurUrl}
        />
    )
}

export default ImageKitWrapper
