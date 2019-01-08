"use strict"

export function isEmail(str) {
  const emailPatt = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPatt.test(str);
}

/**
 * Function scorePassword
 * score password strength
 * 0 : no password typed
 * 1-2 : wreid
 * 3-4 : weak
 * 5   : medium
 * 6   : good
 * 7   : awesome
 * @param {String} password 
 */
export function scorePassword(password) {

  let score = 2;     // bias to 2, as score 0 means no password typed

  if (password.length == 0) {
    return 0;                     // no password typed, score is 0
  }
  else if (password.length < 6) {
    score -= 2;                // 1 -5 chars, score will vary from 1 - 4
  } 
  else if (password.length == 6) {
    score -= 1;               // 6 chars, score will vary from 2 - 5
                                 // 7 char, score will vary from 2 - 6
  } 
  else if (password.length > 7 ) {
    score += 1;               // more than 8 chars, strength will vary from 3 - 7
  }

  score += /[a-z]/.test(password) ? 1 : 0;
  score += /[A-Z]/.test(password) ? 1 : 0;
  score += /[0-9]/.test(password) ? 1 : 0;
  score += /\W/.test(password)    ? 1 : 0;

  return score;

} 
