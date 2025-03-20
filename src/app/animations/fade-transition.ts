import { AnimationController } from '@ionic/angular';

export const fadeTransition = (baseEl: HTMLElement, opts?: any) => {
  const animationCtrl = new AnimationController();

  return animationCtrl.create()
    .addElement(baseEl)
    .duration(400) // Durée en millisecondes
    .easing('ease-in-out')
    .fromTo('opacity', 0, 1);
};
