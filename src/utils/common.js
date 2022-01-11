import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export const formatTime = (date) => moment(date).format('hh:mm');

export const formatDate = (date) => moment(date).format('DD MMMM');
