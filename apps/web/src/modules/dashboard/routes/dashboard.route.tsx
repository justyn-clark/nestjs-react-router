import { Dashboard } from '../../../components/Dashboard';
import { rootAction } from '../../../routes/actions';
import { dashboardLoader } from '../../../routes/loaders';

export const id = 'dashboard';
export const loader = dashboardLoader;
export const action = rootAction;
export const Component = Dashboard;
