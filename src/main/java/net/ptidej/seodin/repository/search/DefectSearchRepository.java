package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.Defect;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Defect entity.
 */
public interface DefectSearchRepository extends ElasticsearchRepository<Defect, Long> {
}
