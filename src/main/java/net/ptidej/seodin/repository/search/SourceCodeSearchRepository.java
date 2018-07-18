package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.SourceCode;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SourceCode entity.
 */
public interface SourceCodeSearchRepository extends ElasticsearchRepository<SourceCode, Long> {
}
