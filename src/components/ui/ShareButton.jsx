import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from 'react-share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const ShareButton = ({ event }) => {
  const shareUrl = `${window.location.origin}/eventDetails/${event.id}`;
  const title = `Check out this event: ${event.name}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg">
      <button
        onClick={copyToClipboard}
        className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        title="Copy link"
      >
        <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
      </button>

      <FacebookShareButton
        url={shareUrl}
        quote={title}
        className="focus:outline-none"
      >
        <FacebookIcon size={24} round className="opacity-90 hover:opacity-100 transition-opacity" />
      </FacebookShareButton>

      <TwitterShareButton
        url={shareUrl}
        title={title}
        className="focus:outline-none"
      >
        <TwitterIcon size={24} round className="opacity-90 hover:opacity-100 transition-opacity" />
      </TwitterShareButton>

      <WhatsappShareButton
        url={shareUrl}
        title={title}
        separator=": "
        className="focus:outline-none"
      >
        <WhatsappIcon size={24} round className="opacity-90 hover:opacity-100 transition-opacity" />
      </WhatsappShareButton>

      <TelegramShareButton
        url={shareUrl}
        title={title}
        className="focus:outline-none"
      >
        <TelegramIcon size={24} round className="opacity-90 hover:opacity-100 transition-opacity" />
      </TelegramShareButton>

      <EmailShareButton
        url={shareUrl}
        subject={title}
        body="Check out this event!"
        className="focus:outline-none"
      >
        <EmailIcon size={24} round className="opacity-90 hover:opacity-100 transition-opacity" />
      </EmailShareButton>
    </div>
  );
};

export default ShareButton;