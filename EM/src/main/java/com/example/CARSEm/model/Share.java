package com.example.CARSEm.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "share",schema = "public")
public class Share implements Serializable{

    @Embeddable
    public static class SharePK implements Serializable {
        private String idactivity;
        private int iduser;

        public SharePK() {
        }

        public SharePK(String idactivity, int iduser) {
            this.idactivity = idactivity;
            this.iduser = iduser;
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

    }

    @EmbeddedId
    private SharePK sharePK;

    // ManyToOne unidireccional
    @MapsId("idactivity")
    @ManyToOne
    @JoinColumn(name = "idactivity")
    private Activity idactivity;

    // ManyToOne unidireccional
    @MapsId("iduser")
    @ManyToOne
    @JoinColumn(name = "iduser")
    private User iduser;

    public Share() {
    }

    public Share(SharePK sharePK) {
        this.sharePK = sharePK;
    }

    public Share(Activity activity, User user) {
        this.idactivity = activity;
        this.iduser = user;
        sharePK = new SharePK(activity.getId(),user.getId());
    }


    public SharePK getSharePK() {
        return sharePK;
    }

    public void setSharePK(SharePK sharePK) {
        this.sharePK = sharePK;
    }

    public Activity getIdactivity() {
        return idactivity;
    }

    public void setIdactivity(Activity idactivity) {
        this.idactivity = idactivity;
    }

    public User getIduser() {
        return iduser;
    }

    public void setIduser(User iduser) {
        this.iduser = iduser;
    }
}
