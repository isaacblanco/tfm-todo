import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent, IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { TagDTO } from '../../../core/models/tag-DTO';
import { TagService } from '../../../core/services/tag.service';
import { UserService } from '../../../core/services/user.service';
@Component({
  selector: 'app-select-labels',
  templateUrl: './select-labels.component.html',
  styleUrls: ['./select-labels.component.scss'],
  standalone: true,
  imports: [ FormsModule, CommonModule, IonIcon,IonItem, IonList, IonLabel,
    IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons],
})
export class SelectLabelsComponent implements OnInit {
  tags: TagDTO[] = [];
  newTagName: string = '';
  errorMessage: string | null = null;

  constructor(
    private modalController: ModalController,
    private tagService: TagService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.userService.getUserId();

    if (!userId) {
      this.errorMessage = 'Error: No se pudo obtener el usuario.';
      return;
    }

    this.loadTags();
  }

  /**
   * Cierra la ventana modal.
   */
  dismissModal(): void {
    this.modalController.dismiss();
  }

  /**
   * Carga las etiquetas asociadas al usuario.
   */
  private loadTags(): void {
    this.tagService.getTags().subscribe({
      next: (data) => {
        this.tags = data;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las etiquetas.';
        console.error(err);
      },
    });
  }

  /**
   * Crea una nueva etiqueta.
   */
  createTag(): void {
    const userId = this.userService.getUserId();

    if (!userId) {
      this.errorMessage = 'Error: Usuario no encontrado.';
      return;
    }

    const newTag: TagDTO = {
      id_tag: 0,
      tag_name: this.newTagName.trim(),
      fk_user: userId,
    };

    this.tagService.addTag(newTag).subscribe({
      next: (createdTag) => {
        this.tags.push(createdTag);
        this.newTagName = ''; // Limpiar el campo
      },
      error: (err) => {
        this.errorMessage = 'Error al crear la etiqueta.';
        console.error(err);
      },
    });
  }

  /**
   * Actualiza una etiqueta existente.
   */
  updateTag(tag: TagDTO): void {
    this.tagService
      .updateTag(tag.id_tag, { tag_name: tag.tag_name })
      .subscribe({
        next: (updatedTag) => {
          //console.log('Etiqueta actualizada:', updatedTag);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar la etiqueta.';
          console.error(err);
        },
      });
  }

  /**
   * Elimina una etiqueta existente.
   */
  deleteTag(tag: TagDTO): void {
    this.tagService.deleteTag(tag.id_tag).subscribe({
      next: () => {
        this.tags = this.tags.filter((t) => t.id_tag !== tag.id_tag); // Eliminar de la lista local
      },
      error: (err) => {
        this.errorMessage = 'Error al eliminar la etiqueta.';
        console.error(err);
      },
    });
  }
}
