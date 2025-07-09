import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
}: OptimizedImageProps) => {
  const [error, setError] = useState(false);

  // If there's an error with Next.js Image, fallback to regular img
  if (error) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      fill={fill}
      sizes={sizes}
      onError={() => setError(true)}
      quality={85}
    />
  );
};

export default OptimizedImage; 