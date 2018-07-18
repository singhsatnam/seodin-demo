package net.ptidej.seodin.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import net.ptidej.seodin.domain.enumeration.LogKind;

import net.ptidej.seodin.domain.enumeration.ArtifactStatus;

/**
 * A InteractiveLog.
 */
@Entity
@Table(name = "interactive_log")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "interactivelog")
public class InteractiveLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "kind")
    private LogKind kind;

    @Column(name = "source_handle")
    private String sourceHandle;

    @Column(name = "origin")
    private String origin;

    @Column(name = "delta")
    private String delta;

    @Column(name = "recorded")
    private LocalDate recorded;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ArtifactStatus status;

    @Column(name = "author")
    private String author;

    @Column(name = "license")
    private String license;

    @ManyToOne
    private Developer developer;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LogKind getKind() {
        return kind;
    }

    public InteractiveLog kind(LogKind kind) {
        this.kind = kind;
        return this;
    }

    public void setKind(LogKind kind) {
        this.kind = kind;
    }

    public String getSourceHandle() {
        return sourceHandle;
    }

    public InteractiveLog sourceHandle(String sourceHandle) {
        this.sourceHandle = sourceHandle;
        return this;
    }

    public void setSourceHandle(String sourceHandle) {
        this.sourceHandle = sourceHandle;
    }

    public String getOrigin() {
        return origin;
    }

    public InteractiveLog origin(String origin) {
        this.origin = origin;
        return this;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDelta() {
        return delta;
    }

    public InteractiveLog delta(String delta) {
        this.delta = delta;
        return this;
    }

    public void setDelta(String delta) {
        this.delta = delta;
    }

    public LocalDate getRecorded() {
        return recorded;
    }

    public InteractiveLog recorded(LocalDate recorded) {
        this.recorded = recorded;
        return this;
    }

    public void setRecorded(LocalDate recorded) {
        this.recorded = recorded;
    }

    public ArtifactStatus getStatus() {
        return status;
    }

    public InteractiveLog status(ArtifactStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ArtifactStatus status) {
        this.status = status;
    }

    public String getAuthor() {
        return author;
    }

    public InteractiveLog author(String author) {
        this.author = author;
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getLicense() {
        return license;
    }

    public InteractiveLog license(String license) {
        this.license = license;
        return this;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public InteractiveLog developer(Developer developer) {
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
        InteractiveLog interactiveLog = (InteractiveLog) o;
        if (interactiveLog.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), interactiveLog.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "InteractiveLog{" +
            "id=" + getId() +
            ", kind='" + getKind() + "'" +
            ", sourceHandle='" + getSourceHandle() + "'" +
            ", origin='" + getOrigin() + "'" +
            ", delta='" + getDelta() + "'" +
            ", recorded='" + getRecorded() + "'" +
            ", status='" + getStatus() + "'" +
            ", author='" + getAuthor() + "'" +
            ", license='" + getLicense() + "'" +
            "}";
    }
}
