import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

import styles from "./Comments.module.scss";
import defaultPhoto from "../../images/avatar-default.png";
import firebase from "firebase/app";
import { db } from "../../firebase";
import Modal from "../Modal/Modal";

const Comments = ({ user }) => {
    const [ input, setInput ] = useState("");
    const [ commentsList, setCommentsList ] = useState([]);
    const [ showCommentModal, setShowCommentModal ] = useState(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);

    const { recipeId } = useParams();

    useEffect(() => {
        db.collection("recipes").doc(recipeId).collection("comments")
        .orderBy("createdTime", "desc")
        .onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                isEditing: false,
            }))
            setCommentsList(data);
        })
    }, [recipeId]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    }

    const postComment = () => {
        let doc = db.collection("recipes").doc(recipeId).collection("comments").doc();
        doc.set({
            writerId: user.uid,
            writerDisplayName: user.displayName,
            writerPhotoURL: user.photoURL,
            content: input,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            commentId: doc.id,
        });
        setInput("");
        setShowCommentModal(false);
    }

    const handleEditing = (index) => {
        setCommentsList(commentsList.map(item => {
            if(item.commentId === index) {
                return ({
                    ...item,
                    isEditing: !item.isEditing,
                })
            }
            return item;
        }));
    }

    const deleteComment = (index) => {
        db.collection("recipes").doc(recipeId).collection("comments").doc(index).delete()
        .then(result => console.log("成功刪除評論"))
        .catch(err => console.log(err));
        setShowDeleteModal(false);
    }

    const toggleShowCommentModal = () => {
        setShowCommentModal(!showCommentModal);
    }

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    }

    // 依照登入狀況render評論section
    let writeComment;
    if (user) {
        writeComment = 
        <div className={styles.form}>
            <img src={user.photoURL} alt=""></img>
            <div className={styles.input}>
                <textarea value={input} onChange={handleInputChange} placeholder="發表對這個食譜的想法或試做的心得吧！"></textarea>
                {
                    input.trim().length > 0 ?
                    <button className={styles.fullBtn} onClick={toggleShowCommentModal}>發布留言</button>
                    : <button className={styles.fullBtn} disabled>發布留言</button>
                }
            </div>
        </div>
    } else {
        writeComment = 
        <div className={styles.form}>
            <img src={defaultPhoto} alt=""></img>
            <div className={styles.input}>
                <textarea value={input} onChange={handleInputChange} placeholder="嗨訪客，請先登入才能發表留言哦！" disabled></textarea>
                <button className={styles.fullBtn} disabled>發布留言</button>
            </div>
        </div>
    }

    return(
        <div className={styles.commentsContainer}>
            <div className={styles.title}>留言 {commentsList.length} 則</div>
            { writeComment }
            <div>
                {
                    commentsList.map(comment => {
                        if (comment.writerId === user.uid) {
                            return (
                                <div className={styles.comment} key={comment.commentId}>
                                    <img src={comment.writerPhotoURL} alt=""></img>
                                    <div className={styles.body}>
                                    <div className={styles.name}>{comment.writerDisplayName}<span>{comment.createdTime && comment.createdTime.toDate().toLocaleDateString()}</span></div>
                                        <div>{comment.content}</div>
                                    </div>
                                    <div className={styles.edit} onClick={() => handleEditing(comment.commentId)}>
                                        <FontAwesomeIcon icon={faEllipsisH}/>
                                        {
                                            comment.isEditing && 
                                            // <div className={styles.delete} onClick={() => deleteComment(comment.commentId)}>
                                            //     <div>刪除留言</div>
                                            // </div>
                                            <div className={styles.delete} onClick={toggleShowDeleteModal}>
                                                <div>刪除留言</div>
                                            </div>
                                        }
                                    </div>
                                    {
                                        showDeleteModal && 
                                        <Modal text="確定要刪除這則留言？" handleCancel={toggleShowDeleteModal} handelConfirm={() => deleteComment(comment.commentId)}/>
                                    }
                                </div>
                            )
                        }
                        return (
                            <div className={styles.comment} key={comment.commentId}>
                                <img src={comment.writerPhotoURL} alt=""></img>
                                <div className={styles.body}>
                                    <div className={styles.name}>{comment.writerDisplayName}<span>{comment.createdTime && comment.createdTime.toDate().toLocaleDateString()}</span></div>
                                    <div>{comment.content}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {
                showCommentModal &&
                <Modal text="確定要發布這則留言？" handleCancel={toggleShowCommentModal} handelConfirm={postComment}/>
            }
        </div>
    )
}

export default Comments;