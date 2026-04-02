import { Stream } from '../../../components/Stream';
import { streamLoader } from '../../../routes/loaders';

export const id = 'stream';
export const loader = streamLoader;
export const Component = Stream;
