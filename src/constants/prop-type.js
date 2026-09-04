// Константа для типизации роли

import PropTypes from 'prop-types';
import { ROLE } from './role';

// в роль ROLE преедается одно из числе от 0 до 3 и нам нужно не просто написать что тип number, но на самом деле в роль передается не любое число а конкретно от 0 до 3, поэтому нужно это конкретно типизировать, пишем oneOf (одно значение из) и здесь мы должны передать массив этих значений и этот массив мы можем получить из константы, потому что константа может редактироваться и чтобы нам вручную не пришлось редактировать и тип, то получим из самой константы этот список-массив значений oneOf(Object.values(ROLE))
// COMMENT это объект, поэтому описываем его с помощью shape
const ROLE_ID = PropTypes.oneOf(Object.values(ROLE));

export const PROP_TYPE = {
	ROLE_ID,
	ROLE: PropTypes.shape({
		id: ROLE_ID,
		name: PropTypes.string.isRequired,
	}),
	ERROR: PropTypes.oneOfType([PropTypes.string, PropTypes.exact(null)]),
	COMMENT: PropTypes.shape({
		id: PropTypes.string.isRequired,
		author: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		publishedAt: PropTypes.string.isRequired,
	}),
	POST: PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		imageUrl: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		publishedAt: PropTypes.string.isRequired,
	}),
};
