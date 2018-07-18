package net.ptidej.seodin.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A ThinkAloud.
 */
@Entity
@Table(name = "think_aloud")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "thinkaloud")
public class ThinkAloud implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag")
    private String tag;

    @Column(name = "description")
    private String description;

    @Column(name = "author")
    private String author;

    @Column(name = "license")
    private String license;

    @OneToMany(mappedBy = "thinkaloud")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Note> notes = new HashSet<>();

    @OneToMany(mappedBy = "thinkaloud")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Video> videos = new HashSet<>();

    @ManyToOne
    private SoftwareSystem softwareSystem;

    @ManyToOne
    private Developer developer;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTag() {
        return tag;
    }

    public ThinkAloud tag(String tag) {
        this.tag = tag;
        return this;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getDescription() {
        return description;
    }

    public ThinkAloud description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuthor() {
        return author;
    }

    public ThinkAloud author(String author) {
        this.author = author;
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getLicense() {
        return license;
    }

    public ThinkAloud license(String license) {
        this.license = license;
        return this;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public Set<Note> getNotes() {
        return notes;
    }

    public ThinkAloud notes(Set<Note> notes) {
        this.notes = notes;
        return this;
    }

    public ThinkAloud addNote(Note note) {
        this.notes.add(note);
        note.setThinkaloud(this);
        return this;
    }

    public ThinkAloud removeNote(Note note) {
        this.notes.remove(note);
        note.setThinkaloud(null);
        return this;
    }

    public void setNotes(Set<Note> notes) {
        this.notes = notes;
    }

    public Set<Video> getVideos() {
        return videos;
    }

    public ThinkAloud videos(Set<Video> videos) {
        this.videos = videos;
        return this;
    }

    public ThinkAloud addVideo(Video video) {
        this.videos.add(video);
        video.setThinkaloud(this);
        return this;
    }

    public ThinkAloud removeVideo(Video video) {
        this.videos.remove(video);
        video.setThinkaloud(null);
        return this;
    }

    public void setVideos(Set<Video> videos) {
        this.videos = videos;
    }

    public SoftwareSystem getSoftwareSystem() {
        return softwareSystem;
    }

    public ThinkAloud softwareSystem(SoftwareSystem softwareSystem) {
        this.softwareSystem = softwareSystem;
        return this;
    }

    public void setSoftwareSystem(SoftwareSystem softwareSystem) {
        this.softwareSystem = softwareSystem;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public ThinkAloud developer(Developer developer) {
        this.developer = developer;
        return this;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ThinkAloud thinkAloud = (ThinkAloud) o;
        if (thinkAloud.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), thinkAloud.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ThinkAloud{" +
            "id=" + getId() +
            ", tag='" + getTag() + "'" +
            ", description='" + getDescription() + "'" +
            ", author='" + getAuthor() + "'" +
            ", license='" + getLicense() + "'" +
            "}";
    }
}
