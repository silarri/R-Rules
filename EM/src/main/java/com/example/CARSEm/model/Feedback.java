package com.example.CARSEm.model;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "feedback",schema = "public")
public class Feedback implements Serializable{

    @Embeddable
    public static class FeedbackPK implements Serializable {
        private String idactivity;
        private int iduser;
        private int idcontext;

        public FeedbackPK() {
        }

        public FeedbackPK(String idactivity, int iduser, int idcontext) {
            this.idactivity = idactivity;
            this.iduser = iduser;
            this.idcontext = idcontext;
        }

        public String getIdactivity() {
            return idactivity;
        }

        public void setIdactivity(String idactivity) {
            this.idactivity = idactivity;
        }

        public int getIduser() {
            return iduser;
        }

        public void setIduser(int iduser) {
            this.iduser = iduser;
        }

        public int getIdcontext() {
            return idcontext;
        }

        public void setIdcontext(int idcontext) {
            this.idcontext = idcontext;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            FeedbackPK that = (FeedbackPK) o;
            return idcontext == that.idcontext &&
                    Objects.equals(idactivity, that.idactivity) &&
                    Objects.equals(iduser, that.iduser);
        }

        @Override
        public int hashCode() {
            return Objects.hash(idactivity, iduser, idcontext);
        }
    }

    @EmbeddedId
    private FeedbackPK feedbackPK;

    private Boolean clicked;
    private Boolean saved;
    private Boolean discarded;
    private int rate;
    private LocalDateTime timestamp;

    // ManyToOne unidireccional
    @MapsId("idcontext")
    @ManyToOne
    @JoinColumn(name = "idcontext")
    private Context context;

    // ManyToOne unidireccional
    @MapsId("idauser")
    @ManyToOne
    @JoinColumn(name = "iduser")
    private User user;

    // ManyToOne unidireccional
    @MapsId("idactivity")
    @ManyToOne
    @JoinColumn(name = "idactivity")
    private Activity activity;

    public Feedback() {
    }

    public Feedback(Boolean clicked, Boolean saved, Boolean discarded, int rate,
                    Context context, int idUser, String idActivity, LocalDateTime timestamp) {
        this.clicked = clicked;
        this.saved = saved;
        this.discarded = discarded;
        this.rate = rate;
        this.context = context;
        this.feedbackPK = new FeedbackPK(idActivity, idUser, context.getIdcontext());
        this.timestamp = timestamp;
    }

    public Feedback(Boolean clicked, Boolean saved, Boolean discarded, int rate,
                    Context context, User user, Activity activity, LocalDateTime timestamp) {
        this.clicked = clicked;
        this.saved = saved;
        this.discarded = discarded;
        this.rate = rate;
        this.context = context;
        this.user = user;
        this.activity = activity;
        this.feedbackPK = new FeedbackPK(activity.getId(), user.getId(), context.getIdcontext());
        this.timestamp = timestamp;
    }

    public FeedbackPK getFeedbackPK() {
        return feedbackPK;
    }

    public void setFeedbackPK(FeedbackPK feedbackPK) {
        this.feedbackPK = feedbackPK;
    }

    public Boolean getClicked() {
        return clicked;
    }

    public void setClicked(Boolean clicked) {
        this.clicked = clicked;
    }

    public Boolean getSaved() {
        return saved;
    }

    public void setSaved(Boolean saved) {
        this.saved = saved;
    }

    public Boolean getDiscarded() {
        return discarded;
    }

    public void setDiscarded(Boolean discarded) {
        this.discarded = discarded;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}