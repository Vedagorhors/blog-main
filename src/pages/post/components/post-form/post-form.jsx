import { useRef, useState } from 'react';
import { Icon, Input } from '../../../../components';
import { SpecialPanel } from '../special-panel/special-panel';
import { savePostAsync } from '../../../../actions';
import { sanitizeContent } from './utils';
import { useServerRequest } from '../../../../hooks';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PROP_TYPE } from '../../../../constants';

const PostFormContainer = ({
	className,
	post: { id, title, imageUrl, content, publishedAt },
}) => {
	const [imageUrlValue, setImageUrlValue] = useState(imageUrl);
	const [titleValue, setTitleValue] = useState(title);
	const contentRef = useRef(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const requestServer = useServerRequest();

	const onImageChange = ({ target }) => setImageUrlValue(target.value);
	const onTitleChange = ({ target }) => setTitleValue(target.value);

	const onSave = () => {
		const newContent = sanitizeContent(contentRef.current.innerHTML);
		dispatch(
			savePostAsync(requestServer, {
				id,
				imageUrl: imageUrlValue,
				title: titleValue,
				content: newContent,
			}),
		).then(({ id }) => navigate(`/post/${id}`));
	};

	return (
		<div className={className}>
			{}
			{}

			{}
			<Input
				name="imageUrl"
				value={imageUrlValue}
				placeholder="Изображение..."
				onChange={onImageChange}
			/>
			<Input
				name="title"
				value={titleValue}
				placeholder="Заголовок..."
				onChange={onTitleChange}
			/>

			{}
			<SpecialPanel
				id={id}
				publishedAt={publishedAt}
				margin="20px 0"
				editButton={
					<Icon
						id="fa-floppy-o"
						size="21px"
						margin="0 10px 0 0"
						onClick={onSave}
					/>
				}
			/>
			{}
			{}
			<div
				ref={contentRef}
				contentEditable={true}
				suppressContentEditableWarning={true}
				className="post-text"
			>
				{content}
			</div>
			{}
		</div>
	);
};

export const PostForm = styled(PostFormContainer)`
	& img {
		float: left;
		margin: 0 20px 10px 0;
	}

	& .post-text {
		min-height: 80px;
		border: 1px solid #000;
		font-size: 18px;
		white-space: pre-line;
	}
`;

PostForm.propTypes = {
	post: PROP_TYPE.POST.isRequired,
};
