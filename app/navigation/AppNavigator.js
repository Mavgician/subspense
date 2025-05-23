import { createStackNavigator } from '@react-navigation/stack';

import HomeTabs from '../navigation/HomeTabs';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import EditBalanceScreen from '../screens/EditBalanceScreen';
import EditExpenseScreen from '../screens/EditExpenseScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import GetStartedScreen from '../screens/GetStartedScreen';
import NewExpenseScreen from '../screens/NewExpenseScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SigninScreen from '../screens/SigninScreen';
import SplashScreen from '../screens/SplashScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import VerifiedAccountScreen from '../screens/VerifiedAccountScreen';
import VerifyAccountScreen from '../screens/VerifyAccountScreen';

// 1. Import the EditBalanceScreen component
//    Make sure the path '../screens/EditBalanceScreen' is correct for your project structure.

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }} // Hide header globally
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
      <Stack.Screen name="VerifiedAccount" component={VerifiedAccountScreen} />
      <Stack.Screen name="Signin" component={SigninScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />

      {/* HomeTabs to display bottom navigation */}
      <Stack.Screen name="HomeTabs" component={HomeTabs} />

      {/* Screens accessible from HomeTabs or other parts of the app */}
      <Stack.Screen name="NewExpense" component={NewExpenseScreen} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <Stack.Screen name="EditExpense" component={EditExpenseScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />

      <Stack.Screen
        name="EditBalanceScreen" // This name matches what HomeScreen uses
        component={EditBalanceScreen} // Use the imported component
      />
    </Stack.Navigator>
  );
}