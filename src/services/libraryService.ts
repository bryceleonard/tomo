import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth } from '../firebase/config';
import { db } from '../firebase/config';
import { Meditation, Library } from '../types/user';

export class LibraryService {
  private static instance: LibraryService;
  private auth = getFirebaseAuth();

  private constructor() {}

  public static getInstance(): LibraryService {
    if (!LibraryService.instance) {
      LibraryService.instance = new LibraryService();
    }
    return LibraryService.instance;
  }

  private getUserId(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    return user.uid;
  }

  private getLibraryRef() {
    const userId = this.getUserId();
    return doc(db, 'library', userId);
  }

  private getMeditationRef(meditationId: string) {
    const userId = this.getUserId();
    return doc(db, 'library', userId, 'meditations', meditationId);
  }

  async getLibrary(): Promise<Library> {
    const libraryRef = this.getLibraryRef();
    const libraryDoc = await getDoc(libraryRef);
    
    if (!libraryDoc.exists()) {
      // Initialize library if it doesn't exist
      const newLibrary: Library = {
        userId: this.getUserId(),
        meditations: []
      };
      await setDoc(libraryRef, newLibrary);
      return newLibrary;
    }

    return libraryDoc.data() as Library;
  }

  async saveMeditation(meditation: Meditation): Promise<void> {
    const meditationRef = this.getMeditationRef(meditation.id);
    await setDoc(meditationRef, meditation);

    // Update library document
    const libraryRef = this.getLibraryRef();
    const library = await this.getLibrary();
    const updatedMeditations = [...library.meditations, meditation];
    await updateDoc(libraryRef, { meditations: updatedMeditations });
  }

  async deleteMeditation(meditationId: string): Promise<void> {
    const meditationRef = this.getMeditationRef(meditationId);
    await deleteDoc(meditationRef);

    // Update library document
    const libraryRef = this.getLibraryRef();
    const library = await this.getLibrary();
    const updatedMeditations = library.meditations.filter(m => m.id !== meditationId);
    await updateDoc(libraryRef, { meditations: updatedMeditations });
  }

  async updateMeditationTitle(meditationId: string, newTitle: string): Promise<void> {
    const meditationRef = this.getMeditationRef(meditationId);
    await updateDoc(meditationRef, { title: newTitle });

    // Update library document
    const libraryRef = this.getLibraryRef();
    const library = await this.getLibrary();
    const updatedMeditations = library.meditations.map(m => 
      m.id === meditationId ? { ...m, title: newTitle } : m
    );
    await updateDoc(libraryRef, { meditations: updatedMeditations });
  }
} 