import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public fb: FormGroup;
  private firma: any;

  // tslint:disable-next-line:ban-types
  private signaturePadOptions: Object = {
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 100
  };

  constructor(private social: SocialSharing, private formBuilder: FormBuilder,
              private toastController: ToastController) {
    this.crearFormulario();
  }

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 5);
    this.signaturePad.clear();
  }

    pintarFirma() {
      console.log(this.signaturePad.toDataURL());
      this.firma = this.signaturePad.toDataURL();
  }

     async compartirMail() {
      const mensaje = this.fb.get('campos1').value;
      const  mensaje2 = this.fb.get('campo2').value;
      this.social.canShareViaEmail().then(() => {
        this.social.shareViaEmail(mensaje, mensaje2, null, ['sebassalazar1402@gmail.com'],
            null, this.firma).then(() => {console.log('envio');})
            .catch((err) => {
              this.mensajeError();
            });
      }).catch(() => {
        this.mensajeError();
      });

    }

  async compartirWhatsapp() {
    const mensaje = this.fb.get('campos1').value;
    const  mensaje2 = this.fb.get('campo2').value;
    this.social.shareViaWhatsApp(mensaje2, this.firma, mensaje).then(() => {
    }).catch(() => {
      this.mensajeError();
    });

  }

    private crearFormulario() {
        this.fb = this.formBuilder.group({
            campos1: [''],
            campo2: [''],
            firma: ['']
        });
    }

  async mensajeError() {
      const toast = await this.toastController.create({
        header: 'Error',
        message: 'No es posible enviar mensajes',
        position: 'bottom',
        buttons: [
            {
             icon: 'exit',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      toast.present();
    }

}
