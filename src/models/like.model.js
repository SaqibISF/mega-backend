import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    commentId: {
        type: Schema.Types.ObjectId,
        ref:"Comment"
    },

    videoId: {
        type: Schema.Types.ObjectId,
        ref:"Video"
    },

    tweetId: {
        type: Schema.Types.ObjectId,
        ref:"Tweet"
    },

    likedBy: {
        type: Schema.Types.ObjectId,
        ref:"User"
    }

}, { timestamps: true });

export const Like = mongoose.model("Like", likeSchema);
