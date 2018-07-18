package net.ptidej.seodin.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Study.
 */
@Entity
@Table(name = "study")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "study")
public class Study implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "author")
    private String author;

    @Column(name = "license")
    private String license;

    @OneToMany(mappedBy = "study")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Developer> developers = new HashSet<>();

    @OneToMany(mappedBy = "study")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<SoftwareSystem> softwareSystems = new HashSet<>();

    @OneToMany(mappedBy = "study")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Script> scripts = new HashSet<>();

    @OneToMany(mappedBy = "study")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Task> tasks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Study title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public Study description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuthor() {
        return author;
    }

    public Study author(String author) {
        this.author = author;
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getLicense() {
        return license;
    }

    public Study license(String license) {
        this.license = license;
        return this;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public Set<Developer> getDevelopers() {
        return developers;
    }

    public Study developers(Set<Developer> developers) {
        this.developers = developers;
        return this;
    }

    public Study addDeveloper(Developer developer) {
        this.developers.add(developer);
        developer.setStudy(this);
        return this;
    }

    public Study removeDeveloper(Developer developer) {
        this.developers.remove(developer);
        developer.setStudy(null);
        return this;
    }

    public void setDevelopers(Set<Developer> developers) {
        this.developers = developers;
    }

    public Set<SoftwareSystem> getSoftwareSystems() {
        return softwareSystems;
    }

    public Study softwareSystems(Set<SoftwareSystem> softwareSystems) {
        this.softwareSystems = softwareSystems;
        return this;
    }

    public Study addSoftwareSystem(SoftwareSystem softwareSystem) {
        this.softwareSystems.add(softwareSystem);
        softwareSystem.setStudy(this);
        return this;
    }

    public Study removeSoftwareSystem(SoftwareSystem softwareSystem) {
        this.softwareSystems.remove(softwareSystem);
        softwareSystem.setStudy(null);
        return this;
    }

    public void setSoftwareSystems(Set<SoftwareSystem> softwareSystems) {
        this.softwareSystems = softwareSystems;
    }

    public Set<Script> getScripts() {
        return scripts;
    }

    public Study scripts(Set<Script> scripts) {
        this.scripts = scripts;
        return this;
    }

    public Study addScript(Script script) {
        this.scripts.add(script);
        script.setStudy(this);
        return this;
    }

    public Study removeScript(Script script) {
        this.scripts.remove(script);
        script.setStudy(null);
        return this;
    }

    public void setScripts(Set<Script> scripts) {
        this.scripts = scripts;
    }

    public Set<Task> getTasks() {
        return tasks;
    }

    public Study tasks(Set<Task> tasks) {
        this.tasks = tasks;
        return this;
    }

    public Study addTask(Task task) {
        this.tasks.add(task);
        task.setStudy(this);
        return this;
    }

    public Study removeTask(Task task) {
        this.tasks.remove(task);
        task.setStudy(null);
        return this;
    }

    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
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
        Study study = (Study) o;
        if (study.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), study.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Study{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", author='" + getAuthor() + "'" +
            ", license='" + getLicense() + "'" +
            "}";
    }
}
