import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Solicitud } from '../../../../interfaces/modelos';
import { PostService } from '../../../../services/postService.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevasolicitud',
  templateUrl: './nuevasolicitud.component.html',
  styleUrls: ['./nuevasolicitud.component.css']
})
export class NuevasolicitudComponent implements OnInit {
  parentForm!: FormGroup;
  submitted = false;
  id_vecino: string | null;
  fk_id_vecino!: string;

  constructor(
    private fb: FormBuilder,
    private newsolicitud: PostService,
    private router: Router
  ) { this.id_vecino = sessionStorage.getItem('user_dataID');}

  ngOnInit(): void {
    this.parentForm = this.fb.group({
      titulo: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      asunto: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-ZñÑ ]+$")]],
      descripcion: ["", [Validators.required, Validators.minLength(3)]]
    });
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.parentForm.invalid) {
        return;
    }
    else {
      //capturamos los valores de los formularios y se los entregamos a la variable de la interfaces
      const solicitud: Solicitud = {
        titulo_solicitud: this.parentForm.controls['titulo'].value,
        asunto_solicitud: this.parentForm.controls['asunto'].value,
        descripcion: this.parentForm.controls['descripcion'].value,
        estado_solicitud: "En espera",
        fk_id_vecino: parseInt(this.id_vecino!)
      };
      console.log("solicitud:", solicitud);

      this.newsolicitud.newsolicitud(solicitud).subscribe({
        next: (v) => {
          console.log("Estamos en el next", v);
          if (v.msg == 'Se envio la solicitud') {
            console.log("estamos dentro de V", v);
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Solicitud Enviada!!',
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            this.parentForm.reset();
            this.router.navigate(['/Vecino/accion/solicitudes']);
          });
        },
        error: (error) => {
          console.log("Estamos en el error", error);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al Enviar Solicitud',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    };
  }
}
