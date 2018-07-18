package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.Interview;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Interview entity.
 */
public interface InterviewSearchRepository extends ElasticsearchRepository<Interview, Long> {
}
