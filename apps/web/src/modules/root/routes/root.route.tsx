import ErrorBoundaryComponent from '../../../components/ErrorBoundary';
import { Layout } from '../../../components/Layout';
import { rootAction } from '../../../routes/actions';
import { rootLoader } from '../../../routes/loaders';

export const id = 'root';
export const path = '/';
export const loader = rootLoader;
export const action = rootAction;
export const Component = Layout;
export const ErrorBoundary = ErrorBoundaryComponent;
