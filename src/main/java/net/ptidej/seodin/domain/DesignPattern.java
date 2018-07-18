package net.ptidej.seodin.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

import net.ptidej.seodin.domain.enumeration.ArtifactStatus;

/**
 * A DesignPattern.
 */
@Entity
@Table(name = "design_pattern")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "designpattern")
public class DesignPattern implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag")
    private String tag;

    @Column(name = "author")
    private String author;

    @Column(name = "xml_descriptor")
    private String xmlDescriptor;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ArtifactStatus status;

    @Column(name = "license")
    private String license;

    @ManyToOne
    private SourceCode sourceCode;

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

    public DesignPattern tag(String tag) {
        this.tag = tag;
        return this;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getAuthor() {
        return author;
    }

    public DesignPattern author(String author) {
        this.author = author;
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getXmlDescriptor() {
        return xmlDescriptor;
    }

    public DesignPattern xmlDescriptor(String xmlDescriptor) {
        this.xmlDescriptor = xmlDescriptor;
        return this;
    }

    public void setXmlDescriptor(String xmlDescriptor) {
        this.xmlDescriptor = xmlDescriptor;
    }

    public ArtifactStatus getStatus() {
        return status;
    }

    public DesignPattern status(ArtifactStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ArtifactStatus status) {
        this.status = status;
    }

    public String getLicense() {
        return license;
    }

    public DesignPattern license(String license) {
        this.license = license;
        return this;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public SourceCode getSourceCode() {
        return sourceCode;
    }

    public DesignPattern sourceCode(SourceCode sourceCode) {
        this.sourceCode = sourceCode;
        return this;
    }

    public void setSourceCode(SourceCode sourceCode) {
        this.sourceCode = sourceCode;
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
        DesignPattern designPattern = (DesignPattern) o;
        if (designPattern.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), designPattern.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DesignPattern{" +
            "id=" + getId() +
            ", tag='" + getTag() + "'" +
            ", author='" + getAuthor() + "'" +
            ", xmlDescriptor='" + getXmlDescriptor() + "'" +
            ", status='" + getStatus() + "'" +
            ", license='" + getLicense() + "'" +
            "}";
    }
}
