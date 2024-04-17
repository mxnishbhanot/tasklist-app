import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { AlertController, AnimationController, IonModal, ModalController, PopoverController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FilterModalComponent } from 'src/app/shared/components/filter-modal/filter-modal.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  mode: 'EDIT' | 'ADD' = 'ADD';
  showFilterMenu: boolean = false;
  tasks!: Task[];
  taskInfo: Task | any = {
    id: 0,
    title: '',
    description: '',
    status: 'ACTIVE',
    startDate: '',
    endDate: '',
    priority: 'LOW',
    tasklist: "",
    attachments: [] // Initialize attachments array
  };
  tasklists = [
    {
      _id: '1',
      title: 'Personal'
    },
    {
      _id: '2',
      title: 'Work'
    },
    {
      _id: '3',
      title: 'Shopping'
    }
  ]
  newTag: string = '';
  tags: string[] = [];
  private tasksSubscription!: Subscription
  searchTerm: string = '';

  constructor(private taskService: TaskService, private alertController: AlertController, private modalController: ModalController,private animationController: AnimationController, public popoverController: PopoverController) { }

  ngOnInit() {
    this.tasksSubscription = this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }
  addTask() {
    this.mode = 'ADD';
    this.taskInfo = {
      id: 0,
      title: '',
      description: '',
      status: 'ACTIVE',
      startDate: '',
      endDate: '',
      priority: 'LOW',
      tasklist: '',
      attachments: []
    };
    this.modal.present();
  }

  editTask(task: Task) {
    this.mode = 'EDIT';
    this.taskInfo = { ...task };
    this.modal.present();
  }

  completeTask(task: Task) {
    // Implement logic to mark a task as completed
  }

  async deleteTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Do nothing if user cancels
          }
        },
        {
          text: 'Delete',
          handler: () => {
            // Delete the task
            const index = this.tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
              this.tasks.splice(index, 1);
              // Implement logic to delete task from the backend
            }
          }
        }
      ]
    });

    await alert.present();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.mode === 'ADD') {
      this.tasks.push(this.taskInfo);
      // Implement logic to add a new task
    } else if (this.mode === 'EDIT') {
      // Implement logic to update the existing task
      const index = this.tasks.findIndex(task => task.id === this.taskInfo.id);
      if (index !== -1) {
        this.tasks[index] = this.taskInfo;
      }
    }
    this.modal.dismiss(this.taskInfo, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.tasks.push(this.taskInfo);
      //  this.taskService..next(this.tasks);
    }
  }

  handleDateChange(event: any, type: 'startDate' | 'endDate') {
    console.log(event);

    this.taskInfo[type] = event.detail.value;
  }

  addTag() {
    if (this.newTag.trim() !== '' && !this.tags.includes(this.newTag)) {
      this.tags.push(this.newTag);
      this.newTag = '';
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  async addAttachment(source: 'camera' | 'storage') {
    try {
      if (source === 'camera') {
        // Logic for taking a photo using the camera
        const image = await this.takePhoto();
        // Add the image to your attachments array or do whatever processing you need
      } else if (source === 'storage') {
        // Logic for choosing an image from device storage
        const image = await this.chooseFromStorage();
        // Add the image to your attachments array or do whatever processing you need
      }
    } catch (error) {
      console.error('Error adding attachment:', error);
    }
  }

  async takePhoto() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera, // Capture photo from the device camera
      }) as any;

      // Convert the photo's URI to a base64 string
      const base64Data = await this.convertUriToBase64(capturedPhoto.webPath);

      return {
        url: capturedPhoto.webPath,
        base64Data: base64Data,
        name: `photo_${new Date().getTime()}.jpeg` // You can customize the file name
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  // Function to convert URI to base64
  async convertUriToBase64(uri: string) {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function (error) {
        reject(error);
      };
      xhr.open('GET', uri);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  async chooseFromStorage() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos, // Choose photo from device storage
      }) as any;
  
      // Convert the photo's URI to a base64 string
      const base64Data = await this.convertUriToBase64(capturedPhoto.webPath);
  
      return {
        url: capturedPhoto.webPath,
        base64Data: base64Data,
        name: `photo_${new Date().getTime()}.jpeg` // You can customize the file name
      };
    } catch (error) {
      console.error('Error choosing photo from storage:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  

  removeAttachment(index: number) {
    // Remove the attachment at the specified index
    this.taskInfo.attachments.splice(index, 1);
  }

  getFileName(attachment: string): string {
    // Find the last '/' in the attachment string and return the substring from that index to the end
    return attachment.substring(attachment.lastIndexOf('/') + 1);
  }

  closeModal(choice: string) {
    this.modalController.dismiss({ choice });
  }

  async toggleTaskStatus(task: any) {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to mark this task as completed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            // Perform task completion logic here
            task.status = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
          }
        }
      ]
    });
  
    await alert.present();
  }

  async animateItemRemoval(item: HTMLElement) {
    const animation: Animation | any = this.animationController.create()
      .addElement(item)
      .duration(500)
      .fromTo('opacity', '1', '0')
      .play();
  
    await animation.finished;
  }

  async openTaskModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: {
        task: {} // Pass task data here if needed
      }
    });
    return await modal.present();
  }

  searchTasks() {
   console.log(this.searchTerm, "searched");
  }
  
  

}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate?: string;
  endDate?: string;
  priority: string;
  tasklist?: string;
  attachments?: []
}
