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
 * A Developer.
 */
@Entity
@Table(name = "developer")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "developer")
public class Developer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "license")
    private String license;

    @OneToMany(mappedBy = "developer")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Interview> interviews = new HashSet<>();

    @OneToMany(mappedBy = "developer")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Diary> diaries = new HashSet<>();

    @OneToMany(mappedBy = "developer")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ThinkAloud> thinkAlouds = new HashSet<>();

    @OneToMany(mappedBy = "developer")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Defect> defects = new HashSet<>();

    @OneToMany(mappedBy = "developer")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TestCase> testCases = new HashSet<>();

    @OneToMany(mappedBy = "developer")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<InteractiveLog> interactiveLogs = new HashSet<>();

    @ManyToOne
    private Study study;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Developer name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLicense() {
        return license;
    }

    public Developer license(String license) {
        this.license = license;
        return this;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public Set<Interview> getInterviews() {
        return interviews;
    }

    public Developer interviews(Set<Interview> interviews) {
        this.interviews = interviews;
        return this;
    }

    public Developer addInterview(Interview interview) {
        this.interviews.add(interview);
        interview.setDeveloper(this);
        return this;
    }

    public Developer removeInterview(Interview interview) {
        this.interviews.remove(interview);
        interview.setDeveloper(null);
        return this;
    }

    public void setInterviews(Set<Interview> interviews) {
        this.interviews = interviews;
    }

    public Set<Diary> getDiaries() {
        return diaries;
    }

    public Developer diaries(Set<Diary> diaries) {
        this.diaries = diaries;
        return this;
    }

    public Developer addDiary(Diary diary) {
        this.diaries.add(diary);
        diary.setDeveloper(this);
        return this;
    }

    public Developer removeDiary(Diary diary) {
        this.diaries.remove(diary);
        diary.setDeveloper(null);
        return this;
    }

    public void setDiaries(Set<Diary> diaries) {
        this.diaries = diaries;
    }

    public Set<ThinkAloud> getThinkAlouds() {
        return thinkAlouds;
    }

    public Developer thinkAlouds(Set<ThinkAloud> thinkAlouds) {
        this.thinkAlouds = thinkAlouds;
        return this;
    }

    public Developer addThinkAloud(ThinkAloud thinkAloud) {
        this.thinkAlouds.add(thinkAloud);
        thinkAloud.setDeveloper(this);
        return this;
    }

    public Developer removeThinkAloud(ThinkAloud thinkAloud) {
        this.thinkAlouds.remove(thinkAloud);
        thinkAloud.setDeveloper(null);
        return this;
    }

    public void setThinkAlouds(Set<ThinkAloud> thinkAlouds) {
        this.thinkAlouds = thinkAlouds;
    }

    public Set<Defect> getDefects() {
        return defects;
    }

    public Developer defects(Set<Defect> defects) {
        this.defects = defects;
        return this;
    }

    public Developer addDefect(Defect defect) {
        this.defects.add(defect);
        defect.setDeveloper(this);
        return this;
    }

    public Developer removeDefect(Defect defect) {
        this.defects.remove(defect);
        defect.setDeveloper(null);
        return this;
    }

    public void setDefects(Set<Defect> defects) {
        this.defects = defects;
    }

    public Set<TestCase> getTestCases() {
        return testCases;
    }

    public Developer testCases(Set<TestCase> testCases) {
        this.testCases = testCases;
        return this;
    }

    public Developer addTestCase(TestCase testCase) {
        this.testCases.add(testCase);
        testCase.setDeveloper(this);
        return this;
    }

    public Developer removeTestCase(TestCase testCase) {
        this.testCases.remove(testCase);
        testCase.setDeveloper(null);
        return this;
    }

    public void setTestCases(Set<TestCase> testCases) {
        this.testCases = testCases;
    }

    public Set<InteractiveLog> getInteractiveLogs() {
        return interactiveLogs;
    }

    public Developer interactiveLogs(Set<InteractiveLog> interactiveLogs) {
        this.interactiveLogs = interactiveLogs;
        return this;
    }

    public Developer addInteractiveLog(InteractiveLog interactiveLog) {
        this.interactiveLogs.add(interactiveLog);
        interactiveLog.setDeveloper(this);
        return this;
    }

    public Developer removeInteractiveLog(InteractiveLog interactiveLog) {
        this.interactiveLogs.remove(interactiveLog);
        interactiveLog.setDeveloper(null);
        return this;
    }

    public void setInteractiveLogs(Set<InteractiveLog> interactiveLogs) {
        this.interactiveLogs = interactiveLogs;
    }

    public Study getStudy() {
        return study;
    }

    public Developer study(Study study) {
        this.study = study;
        return this;
    }

    public void setStudy(Study study) {
        this.study = study;
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
        Developer developer = (Developer) o;
        if (developer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), developer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Developer{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", license='" + getLicense() + "'" +
            "}";
    }
}
