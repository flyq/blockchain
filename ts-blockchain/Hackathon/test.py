import sys,pprint
from gexf import Gexf
from lxml import *
# test helloworld.gexf


"""
doc

attvalue
viz -> value
viz -> position
viz -> color

node_list
node_pos_list
node
"""

def test():
    gexf = Gexf("Gephi.org","A Web network")
    graph=gexf.addGraph("undirected","static","A Web network")
     
    atr1 = graph.addNodeAttribute('test1',type='integer',defaultValue='0')

    tmp = graph.addNode("0","Gephi")
    tmp.addAttribute(atr1,"1")

    tmp = graph.addNode("1","Webatlas")
    tmp.addAttribute(atr1,"2")


    tmp = graph.addNode("2","RTGI")
    tmp.addAttribute(atr1,"0")


    tmp = graph.addNode("3","BarabasiLab")
    tmp.addAttribute(atr1,"3")

    graph.addEdge("0","0","1",weight='1')
    graph.addEdge("1","0","2",weight='1')
    graph.addEdge("2","1","0",weight='1')
    graph.addEdge("3","2","1",weight='1')
    graph.addEdge("4","0","3",weight='1')


    output_file=open("./data/data.gexf","w")
    #gexf.write(output_file)

    #Here is the position Test
    node_pos_list = [["10","10"],["0","0"],["0","10"],["10","0"]]
    gexf_xml = gexf.getXML()  
    for gexf_elem in gexf_xml:  
        if gexf_elem.tag == 'graph':  
            for gexf_nodes_links in gexf_elem:  
                if gexf_nodes_links.tag == 'nodes':  
                    print "dealing with nodes viz"  
                    for node in gexf_nodes_links:  
                        tmp_id = node.get('id')
                        #node_id = node_id_list[tmp_id]  
                       	
                        #node_rgb = node_rgb_list[node_id]  
                        node_rgb = ["255","255","255"]
                        #size_value = str(node_size_list[node_id])  
                        size_value = str("1")
                        size = etree.SubElement(node, '{%s}size' % gexf.viz)  
                        size.set('value', size_value)  
                        color = etree.SubElement(node, '{%s}color' % gexf.viz)  
                        color.set('r', node_rgb[0])  
                        color.set('g', node_rgb[1])  
                        color.set('b', node_rgb[2]) 

                        position = etree.SubElement(node, '{%s}position' % gexf.viz) 
                        node_pos = node_pos_list[int(tmp_id)]
                        position.set('x', node_pos[0])
                        position.set('y', node_pos[1]) 



                elif gexf_nodes_links.tag == 'edges':  
                    print "dealing with edges viz"  
                    for edge in gexf_nodes_links:  
                        src_tmp_id = edge.get('source')  
                        dst_tmp_id = edge.get('target')  
                        #src_id = node_id_list[src_tmp_id]
                        src_id = src_tmp_id  
                        #dst_id = node_id_list[dst_tmp_id]  
                        dst_id = dst_tmp_id

                        #weight = str(edge_weigh_lst[(src_id, dst_id)]) 
                        weight = "3" 
                        thickness = etree.SubElement(edge, '{%s}thickness' % gexf.viz)  
                        thickness.set('value', weight)  
                        #color_rgb = edge_color_lst[(src_id, dst_id)] 
                        color_rgb = ["0","0","0"] 
                        color = etree.SubElement(edge, '{%s}color' % gexf.viz)  
                        color.set('r', color_rgb[0])  
                        color.set('g', color_rgb[1])  
                        color.set('b', color_rgb[2])  
      
    output_file.write(etree.tostring(gexf_xml, pretty_print=True, encoding='utf-8', xml_declaration=True))  
    output_file.close()  

test()