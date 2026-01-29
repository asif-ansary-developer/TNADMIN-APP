/*************************************************************
 * Name: tnsmart
*******************************
Author: Mohammed Rizwan S
Date:   23/09/2022 *
**************************************************************/

import { NavOptions, createAnimation } from '@ionic/core';

interface TransitionOptions extends NavOptions {
  progressCallback?: (ani: Animation | undefined) => void;
  baseEl: any;
  enteringEl: HTMLElement;
  leavingEl: HTMLElement | undefined;
}

const getIonPageElement = (element: HTMLElement) => {
  if (element.classList.contains('ion-page > splashy')) {
    return element;
  }

  if (element.classList.contains('ion-page')) {
    return element;
  }
  const ionPage = element.querySelector(
    ':scope > ion-modal, :scope > .ion-page, :scope > ion-nav, :scope > ion-tabs,.ion-page'
  );
  if (ionPage) {
    return ionPage;
  }
  return element;
};

export const pageTransition = (_: HTMLElement, opts: TransitionOptions) => {
  var DURATION = 50;
  const splashEl = opts.leavingEl.querySelector('ion-content');

  if (splashEl.classList.contains('splashy')) DURATION = 500;
  else DURATION = 50;

  const rootTransition = createAnimation().duration(opts.duration || DURATION);

  const enteringPage = createAnimation()
    .addElement(getIonPageElement(opts.enteringEl))
    .beforeRemoveClass('ion-page-invisible');

  const leavingPage = createAnimation().addElement(
    getIonPageElement(opts.leavingEl)
  );

  if (opts.direction === 'forward') {
    enteringPage.fromTo('opacity', '0%', '100%');
  } else {
    leavingPage.fromTo('opacity', '100%', '0%');
  }

  rootTransition.addAnimation(enteringPage);
  rootTransition.addAnimation(leavingPage);

  return rootTransition;
};

export const getElementRoot = (el: HTMLElement, fallback: HTMLElement = el) => {
  return el.shadowRoot || fallback;
};

export const modalEnterTransition = (
  _: HTMLElement,
  opts: TransitionOptions
) => {
  var DURATION = 50;

  const baseEl = getElementRoot(_);
  const wrapper = baseEl.querySelector('.modal-wrapper');

  const rootTransition = createAnimation().duration(DURATION);
  const enteringPage = createAnimation().addElement(wrapper);

  enteringPage.fromTo('transform', 'translateY(0)', 'translateY(0)');
  enteringPage.fromTo('opacity', '0', '1');

  rootTransition.addAnimation(enteringPage);

  return rootTransition;
};

export const modalExitTransition = (
  _: HTMLElement,
  opts: TransitionOptions
) => {
  var DURATION = 50;

  const baseEl = getElementRoot(_);
  const wrapper = baseEl.querySelector('.modal-wrapper');

  const rootTransition = createAnimation().duration(DURATION);
  const leavingPage = createAnimation().addElement(wrapper);

  leavingPage.fromTo('transform', 'translateY(0)', 'translateY(0)');
  leavingPage.fromTo('opacity', '100%', '0%');

  rootTransition.addAnimation(leavingPage);

  return rootTransition;
};
