import { User } from '../types';
import Cookies from 'js-cookie';

// Mock authentication service - replace with real API calls
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'umar@pocketlaw.com' && password === 'password') {
      const user: User = {
        id: '1',
        name: 'Umar Khan',
        email: 'umar@pocketlaw.com',
        role: 'admin',
        department: 'Legal',
        phone: '+1 (555) 123-4567',
        bio: 'Legal professional with 10+ years of experience in contract management and corporate law.',
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date(),
        isActive: true
      };

      // Store token and user data
      Cookies.set(this.TOKEN_KEY, 'mock_jwt_token', { expires: 7 });
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      return user;
    }
    
    throw new Error('Invalid credentials');
  }

  async register(userData: Partial<User> & { password: string }): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: 'user',
      department: userData.department,
      phone: userData.phone,
      bio: userData.bio,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    };

    // Store token and user data
    Cookies.set(this.TOKEN_KEY, 'mock_jwt_token', { expires: 7 });
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    return user;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = Cookies.get(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (token && userData) {
      return JSON.parse(userData);
    }
    
    return null;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  }

  logout(): void {
    Cookies.remove(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!Cookies.get(this.TOKEN_KEY);
  }
}

export const authService = new AuthService();