import { SRLWrapper, useLightbox } from 'simple-react-lightbox';
import { Image } from './AssetDisplay.styled';
import {
  IPFS_RESOLVER_IMAGE,
  RESIZER_IMAGE,
  PROPAGATION_LAG_TIME,
} from '../../utils/constants';
import { useState, useEffect } from 'react';
import { getCachedFiles } from '../../services/upload';

type Props = {
  image: string;
  templateName: string;
  lightbox?: boolean;
  created: string;
};

const lightboxOptions = {
  thumbnails: {
    showThumbnails: false,
  },
  buttons: {
    showDownloadButton: false,
    showThumbnailsButton: false,
    showAutoplayButton: false,
    showNextButton: false,
    showPrevButton: false,
  },
  settings: {
    overlayColor: 'rgba(0, 0, 0)',
  },
};

const AssetImage = ({
  image,
  templateName,
  lightbox,
  created,
}: Props): JSX.Element => {
  const resizedSrc = `${RESIZER_IMAGE}${IPFS_RESOLVER_IMAGE}${image}`;
  const highResSrc = `${IPFS_RESOLVER_IMAGE}${image}`;

  const { openLightbox } = useLightbox();
  const [src, setSrc] = useState(resizedSrc);

  const onImageError = (e) => {
    e.currentTarget.onerror = null;
    setSrc(highResSrc);
  };
  const onImageClick = (_) => lightbox && openLightbox();
  const lightboxElements = [{ src: highResSrc, width: 'auto', height: 'auto' }];

  useEffect(() => {
    (async () => {
      if (new Date().getTime() - parseInt(created) < PROPAGATION_LAG_TIME) {
        const cachedFile = await getCachedFiles(image);

        if (cachedFile[image]) {
          setSrc(cachedFile[image]);
          return;
        }
      }

      setSrc(resizedSrc);
    })();
  }, [image, templateName]);

  return (
    <div>
      <Image
        src={src}
        alt={templateName}
        onError={onImageError}
        onClick={onImageClick}
      />

      {lightbox && (
        <SRLWrapper options={lightboxOptions} elements={lightboxElements} />
      )}
    </div>
  );
};

export default AssetImage;
