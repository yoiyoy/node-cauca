/* eslint-disable no-param-reassign */
export default ($) => {
  $.prototype.innerText = function innerText() {
    return this.html()
      .replace(/<br\/?>/g, '\n')
      .replace(/<[^>]+>|\r/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n[ \t\n]+/g, '\n')
      .trim();
  };
  return $;
};
