import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Colors from '@/constants/Colors';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Repositories',
        }}
      />
      <Tabs.Screen
        name="signin"
        options={{
          title: 'Sign in',
        }}
      />
    </Tabs>
  );
}
