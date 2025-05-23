import { ExpenseProvider } from './context/ExpenseContext';
import AppNavigator from './navigation/AppNavigator';

export default function RootLayout() {
  return (
    <ExpenseProvider>
      <AppNavigator />
    </ExpenseProvider>
  );
}
